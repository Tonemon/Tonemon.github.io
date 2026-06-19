---
title: "Example: Passive Network Fingerprinting of IoT Devices at Scale"
date: "2026-06-12"
category: research
tags: [IoT, fingerprinting, network, academic]
excerpt: "A methodology for passively identifying IoT device types using only network flow metadata, achieving 94.2% accuracy across 847 devices."
---

## Abstract

We collected 14 days of traffic from a campus network containing 847 distinct IoT devices across 23 device categories. Our approach achieves 94.2% accuracy on held-out devices, outperforming prior work by 8.3 percentage points while requiring no DPI infrastructure.

## Methodology

The classifier uses gradient boosting on inter-packet timing and flow-level features:

$$F(x) = \sum_i \lambda_i h_i(x)$$

where $h_i$ are weak classifiers trained on individual feature subsets and $\lambda_i$ are their weights.

## Results

| Category | Precision | Recall | F1 |
|----------|-----------|--------|----|
| Smart TV | 0.97 | 0.95 | 0.96 |
| IP Camera | 0.94 | 0.92 | 0.93 |
| Smart Speaker | 0.91 | 0.89 | 0.90 |

## Conclusion

Passive fingerprinting at this accuracy level has significant implications for network inventory management and anomaly detection in enterprise IoT deployments.
