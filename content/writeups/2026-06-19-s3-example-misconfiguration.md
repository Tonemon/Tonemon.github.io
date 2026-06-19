---
title: "Example: Exploiting Misconfigured S3 Buckets in the Wild"
date: "2026-06-19"
category: writeup
tags: [cloud, AWS, red-team]
excerpt: "A walkthrough of discovering and exploiting publicly exposed S3 buckets during a red team engagement, including enumeration and exfiltration techniques."
platform: hackthebox
difficulty: medium
---

## Overview

During a recent red team engagement, we identified a pattern of misconfigured S3 buckets exposing sensitive customer data through overly permissive bucket policies.

## Enumeration Phase

We used a combination of passive DNS and active probing to identify candidate buckets belonging to the target organization.

```bash
$ aws s3 ls s3://target-backup-prod --no-sign-request
2024-01-12 14:23:01     db-dumps/
2024-01-10 09:15:44     internal-certs/
```

> [!WARNING]
> Only perform this on systems you have explicit written permission to test.

## Findings

The bucket listing revealed several interesting directories including `db-dumps/` and `internal-certs/`.

## Remediation

Apply least-privilege IAM policies and enable S3 Block Public Access at both the account and bucket level.
