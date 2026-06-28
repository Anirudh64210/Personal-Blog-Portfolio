---
title: "Monitoring interpretability in production"
description: "Interpretability isn't just an offline research tool — wiring feature activations into Arize Phoenix and Sentry turns it into a live safety signal."
topic: "infra · observability"
planted: 2026-04-12
---

Interpretability gets framed as an offline research activity. I think that's a mistake. The same feature activations you study in a notebook can run as a **live signal** in production.

In GlassBox, every inference emits its probe scores and top feature activations to **Arize Phoenix**, with **Sentry** catching the anomalies. When an overconfidence probe spikes, that's an event — not a metric you discover three weeks later.

The infra is boring on purpose: a FastAPI service, a RunPod GPU worker, and a thin telemetry layer. The interesting part is what you choose to watch.

*(Placeholder post — replace with your own writing.)*
