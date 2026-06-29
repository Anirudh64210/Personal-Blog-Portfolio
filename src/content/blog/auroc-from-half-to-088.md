---
title: "From 0.50 to 0.88 AUROC with activation normalization"
description: "Why normalizing residual-stream activations before a linear probe is the highest-leverage change for behavioral detection in LLMs."
topic: "interpretability · calibration"
planted: 2026-06-21
backlinkLabel: "GlassBox"
backlinkHref: "https://github.com/Anirudh64210/glassbox"
---

Our first harmful-content probes scored no better than a coin flip. AUROC sat at 0.55, pure chance, even though the signal we wanted was clearly in the model somewhere. Logistic regression on the same activations was getting 0.89, so the signal was there. Raw diff-of-means just could not see it.

The cause turned out to be a single oversized dimension in the residual stream. On Gemma 3 4B at layer 12, one feature had a standard deviation of 6,686 against a median of 4.9, a ratio of over 1,300 to 1. In a raw dot product that one dimension drowned out everything else. The probe was not measuring harm. It was measuring the loudest number in the vector.

Most of our probe gains did not come from a fancier classifier. They came from normalization.

A raw residual stream has wildly different magnitudes across dimensions, tokens, and layers. A linear probe trained on that mostly learns magnitude, not direction, and direction is where behavior lives. Once you divide out the scale, every dimension competes on equal footing and the real signal, spread across many ordinary features, finally dominates.

```python
# normalize per dimension, then diff-of-means
mu = X.mean(0)
sd = X.std(0) + 1e-8
Xn = (X - mu) / sd

direction = Xn[y == 1].mean(0) - Xn[y == 0].mean(0)   # harmful minus benign
direction /= np.linalg.norm(direction) + 1e-8

score = Xn @ direction   # project each activation onto the harmful direction
```

That correction took the same probe, on the same activations, from 0.55 to 0.88 AUROC. Nothing else changed. Same contrastive pairs, same layer, same model.

The lesson stuck: before you reach for a bigger model, make sure your features are pointing the way you think they are. And whatever normalization you train with has to ship with the probe. We save the mean and std alongside the direction, because the exact same transform has to run at inference or the gains vanish.