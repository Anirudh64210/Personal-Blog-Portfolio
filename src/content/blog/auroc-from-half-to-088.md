---
title: "From 0.50 to 0.88 AUROC with activation normalization"
description: "A short note on why normalizing residual-stream activations before a linear probe is the single highest-leverage change for behavioral detection in LLMs."
topic: "interpretability · calibration"
planted: 2026-05-04
---

Most of my probe gains didn't come from a fancier classifier. They came from **normalization**.

A raw residual stream has wildly different magnitudes across tokens and layers. A linear probe trained on that mostly learns *magnitude*, not *direction* — and direction is where behavior lives.

```python
X = acts / acts.norm(dim=-1, keepdim=True)   # unit-norm per token
```

That one line took a probe from chance to genuinely useful. The takeaway: before you reach for a bigger model, make sure your features are pointing the way you think they are.

*(Placeholder post — replace with your own writing.)*
