---
title: "Persona-vector probes for medical LLMs"
description: "Reading harmfulness, uncertainty, and other behaviors straight off a medical LLM's activations, and the custom probe builder that lets a clinician define new ones on demand."
topic: "interpretability · probes"
planted: 2026-06-21
tended: 2026-06-24
backlinkLabel: "GlassBox"
backlinkHref: "https://github.com/Anirudh64210/glassbox"
---

Try it out here - 
> <a href="https://github.com/Anirudh64210/glassbox" target="_blank" rel="noopener">GlassBox</a>

Medical LLMs have a dangerous habit: they sound exactly as confident when they are wrong as when they are right. For **GlassBox** we wanted signals that fire from inside the model, reading behavior off the activations rather than trusting the words that come out. Persona-vector probes are how we do it.

## The idea

A persona-vector probe is a single direction in the model's activation space that corresponds to a behavior. You find it with contrastive pairs: two sets of prompts that differ in exactly one trait, run both through the model, capture the residual stream at a middle layer, and take the difference of the means. That difference is the direction. Project any new activation onto it and you get a score for how much the model is leaning that way, regardless of what it says.

We run this on Gemma 3 4B and tap the residual stream at layer 12, where behavioral information is most linearly accessible.

```python
# one trace per prompt, read the residual stream at the chosen layer
with model.trace(prompt):
    h = model.model.language_model.layers[LAYER].output.save()

vec = h[0].mean(dim=0)        # mean-pool over tokens, one vector per prompt

# normalize per dimension, then diff-of-means
Xn = (X - X.mean(0)) / (X.std(0) + 1e-8)
direction = Xn[y == 1].mean(0) - Xn[y == 0].mean(0)
direction /= direction.norm()

score = Xn @ direction        # project onto the behavior direction
```

The first pass was useless. AUROC sat near chance, because one oversized activation dimension was drowning out the real signal. Normalizing per dimension before the diff fixed it and took the harmful probe from 0.55 to 0.88. That normalization now ships with every direction, since the same transform has to run at inference.

## The probes we built

Each probe is the same recipe with different contrastive pairs.

- **Harmfulness.** Harmful prompts (toxicity, jailbreak, injection) against benign twins matched in length and structure, so the probe learns harm and not style. Cross-validated AUROC around 0.88.
- **Uncertainty.** The same question answered in a confident persona against an uncertain one, drawn from medical question sets. This is the probe aimed straight at the confidently-wrong failure mode.
- **Hallucination.** Grounded answers against confabulated ones, to catch responses that read fluently but are not supported.

Validation is honest, not train-on-self. We cross-validate every probe and report recall at a strict false-positive rate, not just AUROC, so the number reflects how it would actually behave on live traffic.

## The custom probe builder

The behaviors a clinician cares about are not fixed, so the pipeline can mint a new probe on demand. Give it a name and a short description, it generates the contrastive pairs for that concept, extracts the layer-12 activations, computes the normalized direction, and registers it as a live tracker. New behavior, same recipe, no retraining of the model.

## What we learned

Most of the gains did not come from a bigger model or a fancier classifier. They came from getting the features to point the right way: matched pairs so the direction isolates one behavior, and normalization so magnitude does not masquerade as signal. The live monitor reads these directions per message and surfaces them alongside the model's answer, which is what turns a confident black box into something a clinician can actually question.