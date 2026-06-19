---
title: "Example: Home Lab: Building a Network IDS with Suricata"
date: "2026-05-30"
category: project
tags: [homelab, IDS, networking, open-source, suricata, ELK]
excerpt: "Full setup walkthrough of a Suricata-based intrusion detection system in my homelab, with custom rules, EVE JSON logging, and ELK stack integration for real-time alerting."
series: "Building a Security-Focused Home Lab"
series_part: 3
---

## Overview

This is Part 3 of the [[Building a Security-Focused Home Lab]] series. Parts 1 and 2 covered network segmentation with pfSense and a centralized logging pipeline with Filebeat. Here we deploy Suricata as the detection layer and wire its EVE JSON output into the ELK stack.

The screenshots below show the network topology we're building on top of and the resulting alert dashboard:

![Homelab IDS network topology diagram](/images/ids-network-topology.svg)
![Suricata alert dashboard in Kibana](/images/ids-suricata-alerts.svg)

> [!NOTE]
> This setup runs on a dedicated mini-PC (Intel N100, 16 GB RAM) with a quad-port 2.5GbE NIC. One port is the management interface; the other three are configured as a SPAN mirror receiving a copy of all traffic from the managed switch.

## Installing Suricata

Add the official stable PPA and install:

```bash
$ sudo add-apt-repository ppa:oisf/suricata-stable
$ sudo apt update && sudo apt install suricata -y
$ suricata --version
Suricata 7.0.3 RELEASE
```

The default config lives at `/etc/suricata/suricata.yaml`. The key section to configure is the `af-packet` interface binding — point it at the SPAN interface, not the management NIC:

```yaml
af-packet:
  - interface: enp2s0f1   # SPAN mirror port
    cluster-id: 99
    cluster-type: cluster_flow
    defrag: yes
    use-mmap: yes
    tpacket-v3: yes
    ring-size: 200000
    block-size: 32768
```

> [!TIP]
> Set `cluster-type: cluster_flow` (not `cluster_cpu`) so that packets from the same TCP session always land on the same Suricata worker thread. This prevents out-of-order reassembly issues on busy links.

## Enabling Suricata Update and Rule Sources

Suricata ships with no detection rules enabled by default. `suricata-update` manages rulesets:

```bash
$ sudo suricata-update update-sources
$ sudo suricata-update enable-source et/open        # Emerging Threats Open — free
$ sudo suricata-update enable-source ptresearch/attackdetection
$ sudo suricata-update
$ sudo systemctl restart suricata
```

The full ruleset after enabling both sources gives around 47,000 rules. Verify they loaded:

```bash
$ sudo suricatasc -c "ruleset-reload-nonblocking"
$ grep "rules loaded" /var/log/suricata/suricata.log | tail -1
 - 47312 rules successfully loaded
```

## Architecture

The detection pipeline flows through three components:

1. **Suricata** — reads mirrored traffic off the SPAN port, matches rules, writes `eve.json` alerts
2. **Filebeat** — ships `eve.json` to Elasticsearch in real time
3. **Kibana** — dashboards and alert triage

```yaml
# /etc/filebeat/filebeat.yml
filebeat.inputs:
  - type: filestream
    id: suricata-eve
    paths:
      - /var/log/suricata/eve.json
    parsers:
      - ndjson:
          target: ""
          overwrite_keys: true

output.elasticsearch:
  hosts: ["https://elk.homelab.local:9200"]
  username: "filebeat_writer"
  password: "${ELASTIC_PASSWORD}"
  ssl.certificate_authorities: ["/etc/filebeat/certs/ca.crt"]
```

> [!WARNING]
> Do not send EVE JSON directly to an internet-facing Elasticsearch instance. Always use TLS and authentication — unauthenticated Elasticsearch clusters have been responsible for multiple large-scale data leaks.

## Custom Detection Rules

Suricata rules follow Snort syntax. Here's a rule that detects a beacon pattern commonly used by Cobalt Strike's default HTTP C2 profile — regular GET requests to a `/jquery-3.3.1.min.js` path with an unusually small response:

```
alert http $HOME_NET any -> $EXTERNAL_NET any (
  msg:"Possible Cobalt Strike HTTP C2 Beacon (jQuery profile)";
  flow:established,to_server;
  http.method; content:"GET";
  http.uri; content:"/jquery-3.3.1.min.js"; fast_pattern;
  http.header_names; content:!"Referer";
  threshold:type both, track by_src, count 5, seconds 300;
  classtype:trojan-activity;
  sid:9000001; rev:1;
)
```

The rule generation script below automates building threshold variants across multiple C2 URI patterns:

```python
BEACON_PATHS = [
    "/jquery-3.3.1.min.js",
    "/ca",
    "/updates.rss",
    "/load",
]

BASE_SID = 9000001
TEMPLATE = (
    'alert http $HOME_NET any -> $EXTERNAL_NET any ('
    'msg:"Possible CS C2 Beacon ({path})"; '
    'flow:established,to_server; '
    'http.uri; content:"{path}"; fast_pattern; '
    'http.header_names; content:!"Referer"; '
    'threshold:type both, track by_src, count 5, seconds 300; '
    'classtype:trojan-activity; sid:{sid}; rev:1;)'
)

for i, path in enumerate(BEACON_PATHS):
    print(TEMPLATE.format(path=path, sid=BASE_SID + i))
```

> [!NOTE]
> Custom rules go in `/etc/suricata/rules/local.rules`. Add `local.rules` to the `rule-files` list in `suricata.yaml` and run `suricata-update` with `--no-reload` to validate syntax before reloading.

## Alert Triage Workflow

Once alerts are flowing into Kibana, a useful first triage filter is severity × external destination:

```
event_type: "alert" AND alert.severity: 1 AND destination.ip: (NOT 10.0.0.0/8)
```

This surfaces only high-severity rules firing on outbound connections — the most likely true positives in a homelab context. See [[Kibana Detection Rules]] for the full saved search collection I use.

## Performance Tuning

On a 1 Gbps SPAN mirror, Suricata should handle traffic at wire speed. Check for drops:

```bash
$ sudo suricatasc -c "perf-counters"
# Look for capture.kernel_drops > 0
```

If you see drops, increase `ring-size` and `block-size` in the AF-PACKET config, and consider pinning Suricata workers to isolated CPU cores:

```bash
$ sudo systemctl edit suricata
[Service]
CPUAffinity=2 3 4 5
```

## Next Steps

Part 4 of this series covers building custom Kibana dashboards with MITRE ATT&CK tactic overlays, and integrating TheHive for alert-to-case management.
