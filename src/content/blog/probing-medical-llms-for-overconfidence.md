---
title: "Probing medical LLMs for overconfidence"
description: "Training a persona-vector probe that reads overconfidence straight off a medical LLM's activations — and the two changes that moved AUROC from chance to 0.88."
topic: "interpretability · probes"
planted: 2025-02-10
tended: 2026-05-28
backlinkLabel: "GlassBox"
backlinkHref: "https://github.com/Anirudh64210"
---

Medical LLMs have a dangerous habit: they sound exactly as confident when they're wrong as when they're right. For **GlassBox** I wanted a signal that fired *before* a wrong answer left the model — a probe that reads overconfidence directly from the activations.

## The setup

The idea is a **persona-vector probe**: collect hidden states from a known-good and known-bad set, then train a light classifier to separate "calibrated" from "overconfident" directions in activation space.

```python
# extract residual-stream activations at a chosen layer
acts  = model.run_with_cache(tokens)["resid_post"][LAYER]
X     = normalize(acts.mean(dim=1))          # activation normalization
probe = LogisticRegression(class_weight="balanced")
probe.fit(X_train, y_overconfident)
```

The first pass was useless — AUROC sat at chance. Two changes moved it:

- **Activation normalization** before the probe, so magnitude didn't swamp direction.
- **Calibration** on a held-out split, tuned per layer rather than globally.

> Probe AUROC went from 0.50 to >0.88 — enough to gate a response in real time.

## What I'd do differently

Single-layer probes are brittle; the cleaner signal lived across a span of middle layers. The next iteration aggregates a few layers and tracks drift, which is what the live monitor in GlassBox ended up doing through FastAPI + Arize Phoenix.

*(Placeholder post — replace with your own writing.)*
