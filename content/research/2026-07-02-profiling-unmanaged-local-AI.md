---
title: "Identifying capability drift and profiling risks in unmanaged local AI infrastructure"
date: "2026-07-02"
category: research
tags: [shadow AI, agentic AI, tracking capability drift, Tezcat, LLMs, continuous security evaluation, attack surface analysis, local AI infrastructure, risk profiling]
excerpt: "Enterprises increasingly notice local AI deployments inside their networks without approval or onboarding, which results in a class of unmanaged Shadow AI. This paper identifies shadow AI capabilities, capability drift and how to profile risks."
paperUrl: "/papers/profiling-unmanaged-local-AI.pdf"
paperCover: "/paper-covers/profiling-unmanaged-local-AI-cover.png"
authors:
  - name: "Piraveen Kandiah"
    url: "https://www.linkedin.com/in/piraveen-kd/"
  - name: "Tony Munzer"
    url: "https://www.linkedin.com/in/tonymunzer/"
---


*Context: The following paper is part of a Security and Network Engineering (SNE) master thesis done at the University of Amsterdam. The assigned time period for the complete research and development was one month. We have approval from both de UvA and Shell to share our research and toolkit. You can read the full paper by using the sidebar to download it. Citations are removed from the excerpts below.*


## Abstract

Enterprises increasingly notice local AI deployments inside their networks without approval or onboarding, which results in a class of unmanaged Shadow AI. As these instances evolve from single-step generative models into tool-wielding agents with persistent memory, they become a new insider-threat surface. This is compounded by capability drift, which is the cumulative change in what an agent can be made to do as the owners grant it progressively wider access over time. Existing taxonomic frameworks name such risks but rely on static, point-in-time logic that captures neither how an agent's behavior unfolds over time nor the exposure that emerges when individually low-risk actions are chained autonomously. This paper introduces **[Tezcat](https://github.com/TezcatAI/Tezcat)**, an open-source toolkit that continuously enumerates and risk-profiles the capabilities of unmanaged local AI assets, querying them over the same interface an adversary would use. Treating capability as the unit of risk, Tezcat elicits each capability with a versioned prompt library and classifies responses through deterministic rule-based parsers. It then aggregates repeated elicitations into a difficulty- and reliability-weighted score, so that observed execution outweighs self-report, and thin evidence yields an inconclusive verdict instead of a false one. Aligned assessments of the same endpoint are compared to surface drift as discrete, classified transitions. Tezcat is evaluated in an isolated enterprise test environment across six Shadow AI workstations spanning chat-only local models, MCP-enabled local models, and self-hosted frontier agents, such as Hermes and OpenClaw. The results attribute a workstation's exposed attack surface to its active tool integrations and deployment scaffolding rather than to the underlying model. Whether that surface is actually realized depends on the model being capable enough to invoke the mounted tools. Finally, a single, harmless-looking onboarding prompt proved that every tool-capable endpoint was able to chain low-risk Git operations into reaching the secret-bearing history of an internal repository. Evaluating Shadow AI therefore means replacing one-off, per-call checks with recurring probes against the live interface and aggregating the findings across runs, weighting them by observed behavior, and tracking them over successive assessments.


## Introduction


The decentralization of large language models (LLMs) has produced a growing class of Shadow AI, which are unmanaged and unsanctioned AI instances that employees deploy inside enterprise environments without formal approval or oversight. This coincides with a shift in how such systems operate, from single-step generative models to agentic AI that can reason, plan, and act over long-running tasks. A standalone local LLM may pose little risk on its own, but it becomes a serious vulnerability once it is connected to broader enterprise systems through the Model Context Protocol (MCP) or custom agentic tooling. Memory, tool use, and iterative decision cycles let these systems run continuous autonomous workflows, but the same properties could also extend an adversary's reach. An unmanaged agent that holds persistent access and executes actions on its own is, therefore, a new attack surface for insider threats.

Capability drift compounds the problem. As developers iterate on a local agent, they tend to grant it progressively more capabilities, such as wider access to internal APIs and sensitive data. Because that access lets an agent query data and execute actions through shared interfaces, an instance with an acceptable risk profile one week can become a data-exfiltration vector the next. Capability drift therefore, describes the cumulative delta between the capabilities an agent has at an earlier point in time compared to later.

Existing security practices are not built for change of this kind. As risk-management frameworks move from short-lived, non-autonomous systems to agentic ones, their safety assessments still rely largely on static logic models, which struggle to capture how a system's behavior unfolds and interacts over time. Many regulatory frameworks and risk matrices also lack a method to transform general awareness of risk into measurable, reproducible prioritization. When the surrounding corporate infrastructure stays fixed but a local agentic instance keeps gaining capabilities, point-in-time risk assessments and penetration testing no longer capture its behavior or its risk. By the time an organization assesses such an agent, it may already have silently staged lateral movement through shared credentials, exfiltrated sensitive communications and intellectual property, or have been used as a foothold by a threat actor who discovered the attack surface before the organization itself did.

This research proposes [Tezcat](https://github.com/TezcatAI/Tezcat), a continuous security toolkit that discovers, fingerprints, and risk-profiles unmanaged local AI assets. Rather than evaluate a system once, it applies dynamic evaluation to account for time-dependent interactions and to surface vulnerabilities that a single assessment would miss. By querying an AI agent's entry points directly, the toolkit maps the changing attack surface, tracks capability drift over time, and converts those findings into structured risk intelligence.


## Continue reading

*To continue reading the paper, use the sidebar to view the paper in the browser or to download it.*



## Disclaimer

This research was conducted as part of a master's thesis project in collaboration with Shell, which provided the project subject, facilitated on-site access, provided additional testing resources, and offered feedback/suggestions during the research process. The authors are not employees of Shell, have received no financial compensation or sponsorship from Shell or any affiliated party, and have no commercial interest in the outcomes of this research. The contents of this paper reflect the independent academic judgment of the authors and are not influenced by Shell in any way.

The software framework produced as part of this research is released as open-source software under the [MIT License](https://github.com/TezcatAI/Tezcat/blob/main/LICENSE). Prior to publication, explicit approval was obtained from both UvA and Shell to release the framework under these terms. Neither UvA nor Shell retains ownership, intellectual property rights, or exclusive claims over the open source framework or any derivative open source works/forks. This open-source release is intended to enable community-driven continuous development and use by the broader security community worldwide, free from institutional or commercial encumbrance.
