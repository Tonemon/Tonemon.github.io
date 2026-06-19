---
title: "Example: Home Lab: Building a Network IDS with Suricata"
date: "2026-05-30"
category: project
tags: [homelab, IDS, networking, open-source]
excerpt: "Full setup walkthrough of a Suricata-based intrusion detection system in my homelab, with custom rules and ELK stack integration for alerting."
series: "Building a Security-Focused Home Lab"
series_part: 3
---

## Overview

This project covers the full setup of a Suricata-based IDS in my homelab, including network topology, custom rules, and integration with an ELK stack for alerting.

## Installing Suricata

```bash
$ sudo add-apt-repository ppa:oisf/suricata-stable
$ sudo apt update && sudo apt install suricata -y
```

## Architecture

The sensor runs on a dedicated mini-PC with a 4-port NIC configured as a SPAN port mirror.

## Custom Rules

```python
# Example rule generation script
rules = [
    'alert http any any -> $HOME_NET any (msg:"Possible C2 beacon"; flow:established;)',
]
for rule in rules:
    print(rule)
```

## Next Steps

Part 4 of this series covers integrating Suricata EVE logs with an ELK stack for dashboards and alerting.
