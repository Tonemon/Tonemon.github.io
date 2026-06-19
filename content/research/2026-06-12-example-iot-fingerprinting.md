---
title: "Example: Passive Network Fingerprinting of IoT Devices at Scale"
date: "2026-06-12"
category: research
tags: [IoT, fingerprinting, network, academic, machine-learning]
excerpt: "A methodology for passively identifying IoT device types using only network flow metadata, achieving 94.2% accuracy across 847 devices without any deep packet inspection."
paperUrl: "/papers/iot-fingerprinting-example.pdf"
paperCover: "/paper-covers/iot-fingerprinting-cover.png"
---

## Abstract

We collected 14 days of traffic from a campus network containing 847 distinct IoT devices across 23 device categories. Using only flow-level metadata — inter-packet timing, flow duration, packet size variance, and DNS query patterns — our gradient boosting classifier achieves 94.2% accuracy on held-out devices, outperforming prior work by 8.3 percentage points while requiring no DPI infrastructure.

> [!NOTE]
> The dataset and model weights are available at [github.com/Tonemon/iot-fingerprint-dataset](#). Device MAC addresses were anonymized using a one-way hash before release.

## Background and Motivation

Network administrators in enterprise environments struggle to maintain accurate IoT device inventories. Traditional approaches rely on active scanning (which misses firewalled devices) or DPI (which breaks on TLS 1.3 and introduces privacy concerns). Our approach works entirely passively from NetFlow/IPFIX data that most campus routers already export.

Prior work by Miettinen et al. (2017) used DNS queries alone and achieved 85.9% accuracy. Sivanathan et al. (2018) added flow statistics and reached ~90%. We extend this with temporal features derived from inter-packet timing and incorporate a known vulnerability class into the feature set: devices affected by CVE-2021-20090 (a path traversal in the web interfaces of dozens of consumer router models) showed a statistically distinct DNS beacon cadence that served as a reliable fingerprint for that device family.

> [!WARNING]
> Passive fingerprinting at this accuracy level can be used to identify vulnerable device models at scale, facilitating targeted exploitation. We recommend this methodology be used for defensive inventory management and vulnerability tracking, not offensive reconnaissance.

## Methodology

### Feature Extraction

For each flow we extract six feature groups:

| Feature | Description | Importance |
|---------|-------------|------------|
| `ipt_mean` | Mean inter-packet timing (ms) | 78% |
| `flow_dur` | Total flow duration (s) | 61% |
| `pkt_size_var` | Variance in packet sizes | 54% |
| `dns_rate` | DNS queries per minute | 47% |
| `proto_dist` | Protocol distribution vector | 38% |
| `payload_entropy` | Mean Shannon entropy of payloads | 29% |

The importance values are Shapley values averaged over the test set. The feature importance chart and confusion matrix for the top device categories are shown below:

![Feature importance bar chart for IoT device classification](/images/iot-traffic-features.svg)
![Confusion matrix for top 5 device categories](/images/iot-confusion-matrix.svg)

### Model Architecture

The classifier uses gradient boosting on the feature vector $\mathbf{x} \in \mathbb{R}^{42}$:

$$F(\mathbf{x}) = \sum_{m=1}^{M} \lambda_m h_m(\mathbf{x})$$

where $h_m$ are depth-3 decision trees trained on individual feature subsets and $\lambda_m \in (0, 1]$ are shrinkage weights. We use $M = 200$ estimators and a learning rate of $\eta = 0.05$, selected via 5-fold cross-validation.

The loss function is categorical cross-entropy:

$$\mathcal{L} = -\frac{1}{N} \sum_{i=1}^{N} \sum_{c=1}^{C} y_{ic} \log \hat{y}_{ic}$$

where $y_{ic}$ is the one-hot label for device $i$ belonging to class $c$, and $\hat{y}_{ic}$ is the predicted probability.

### Handling Unknown Devices

Closed-set classifiers assume every device belongs to a known class. We extend to open-set recognition using a Mahalanobis distance threshold on the penultimate layer representation:

$$d(\mathbf{x}) = \sqrt{(\mathbf{x} - \boldsymbol{\mu}_c)^T \boldsymbol{\Sigma}^{-1} (\mathbf{x} - \boldsymbol{\mu}_c)}$$

Devices with $d(\mathbf{x}) > \tau$ are classified as *unknown* rather than forced into the nearest known class. We set $\tau = 3.2$ based on the 99th percentile of distances on the validation set.

> [!TIP]
> In practice, setting $\tau$ too low causes many legitimate devices to be flagged as unknown. We recommend calibrating $\tau$ on a holdout set of known-good devices from your specific environment before deployment.

## Implementation

The classifier is implemented in Python using `scikit-learn` and `xgboost`. The main training loop:

```python
import xgboost as xgb
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report

le = LabelEncoder()
y_train_enc = le.fit_transform(y_train)

model = xgb.XGBClassifier(
    n_estimators=200,
    max_depth=3,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    use_label_encoder=False,
    eval_metric="mlogloss",
    random_state=42,
)

model.fit(
    X_train,
    y_train_enc,
    eval_set=[(X_val, le.transform(y_val))],
    early_stopping_rounds=20,
    verbose=False,
)

y_pred = le.inverse_transform(model.predict(X_test))
print(classification_report(y_test, y_pred, target_names=le.classes_))
```

Feature extraction from raw PCAP files uses `scapy` with a custom flow aggregator:

```python
from scapy.all import rdpcap, IP, TCP, UDP
from collections import defaultdict
import numpy as np

def extract_flows(pcap_path: str) -> dict:
    packets = rdpcap(pcap_path)
    flows: dict = defaultdict(list)

    for pkt in packets:
        if not pkt.haslayer(IP):
            continue
        key = (pkt[IP].src, pkt[IP].dst, pkt.proto)
        flows[key].append((pkt.time, len(pkt)))

    features = {}
    for key, pkts in flows.items():
        times, sizes = zip(*pkts)
        ipts = np.diff(times) * 1000  # ms
        features[key] = {
            "ipt_mean": float(np.mean(ipts)) if len(ipts) > 1 else 0.0,
            "flow_dur": float(times[-1] - times[0]),
            "pkt_size_var": float(np.var(sizes)),
            "n_packets": len(pkts),
        }
    return features
```

## Results

| Device Category | Precision | Recall | F1 |
|----------------|-----------|--------|----|
| Smart TV | 0.97 | 0.95 | 0.96 |
| IP Camera | 0.94 | 0.92 | 0.93 |
| Smart Speaker | 0.91 | 0.89 | 0.90 |
| Home Router | 0.96 | 0.97 | 0.96 |
| Smart Thermostat | 0.88 | 0.85 | 0.86 |
| NAS Device | 0.93 | 0.94 | 0.93 |
| **Overall (macro)** | **0.93** | **0.92** | **0.92** |

The largest source of errors was confusion between Smart Speakers and IP Cameras — both produce regular, low-volume HTTPS flows to cloud endpoints. Incorporating device-specific DNS hostnames (e.g., `alexa.amazon.com` vs `lapi.ring.com`) reduced this error rate from 6.3% to 2.1%.

> [!NOTE]
> Results are on the held-out test set (20% stratified split). We report macro-averaged metrics to avoid inflation from the larger Smart TV and Router classes.

## Security Implications

Passive fingerprinting enables several defensive use-cases:

- **Rogue device detection** — alert when an unregistered device type appears on the network
- **Vulnerability targeting** — cross-reference identified device models against NVD to surface high-priority CVEs across the fleet
- **Anomaly detection** — a device whose traffic profile shifts (e.g., a camera starting to generate SSH traffic) can indicate compromise

The same technique has offensive applications. An attacker with passive network access could enumerate the device fleet without generating any active scan traffic, then target devices known to be affected by CVEs like CVE-2021-20090 (path traversal in consumer routers) or CVE-2022-1388 (F5 BIG-IP unauthenticated RCE, also identifiable by traffic fingerprint).

> [!DISCLOSURE] Coordinated Disclosure — CVE-2021-20090 Affected Devices
> - 2021-08-02 — Fingerprinting research identified anomalous beacon cadence in 14 router models
> - 2021-08-05 — Confirmed fingerprint matches devices listed in CVE-2021-20090 advisory
> - 2021-08-10 — Notified affected vendors (Buffalo, Arcadyan, Sagem) via CERT/CC
> - 2021-09-14 — Firmware patches published by Buffalo and Arcadyan
> - 2021-10-01 — Sagem acknowledged, no patch planned (EOL devices)
> - 2022-01-15 — Public fingerprint signatures released after 90-day embargo

## Limitations and Future Work

The current model requires at least 5 minutes of traffic per device to achieve stable classification. Devices that are powered off or idle during the capture window are not fingerprinted. Future work will explore [[one-shot learning]] approaches that can classify devices from a single flow burst, and extend the feature set to include encrypted SNI values from TLS ClientHello messages.

## Conclusion

Passive IoT fingerprinting at 94.2% accuracy is achievable from flow metadata alone, with no DPI and no active probing. The approach generalises across network environments given sufficient training data, and the Mahalanobis open-set extension gracefully handles novel device types. We release the dataset, feature extractor, and trained model weights to facilitate reproducibility.
