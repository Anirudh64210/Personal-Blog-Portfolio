---
title: "Sparse autoencoders, live"
description: "An SAE turns a model's opaque residual stream into a cloud of readable features. Here's how GlassBox uses one as a live interpretability view, and why we don't trust it just on its own."
topic: "interpretability · SAEs"
planted: 2026-06-21
---

Interpretability usually lives in a notebook. You pull a model's activations, poke at them after the fact, and write up what you found. GlassBox runs the same idea live: while the model answers a clinical question, we read its internal state in real time. The piece that makes that state legible is the sparse autoencoder.

Here's the problem an SAE solves. If you grab the residual stream at some layer, you get a few thousand numbers with no obvious meaning. Individual neurons are polysemantic, so one unit fires for several unrelated concepts and you can't point at it and say "that's the uncertainty neuron." The signal is real but tangled.

A sparse autoencoder untangles it. It's trained to reconstruct those activations through a much wider hidden layer where only a handful of units are allowed to fire at once. Those units, the features, come out far more monosemantic than raw neurons. Instead of a few thousand muddy numbers, you get a dictionary of roughly 16k features, almost all off, a few lit up, each one closer to a single human-readable concept.

In GlassBox, that's Family A: the feature cloud. We hook the residual stream once at layer 17 of `gemma-3-4b`, run a pretrained Gemma Scope SAE (16k features) over that activation, and surface the top features that fired. That's the "what's lighting up" view a clinician sees next to the answer. It isn't a score, it's a map of the concepts the model engaged with on this particular question.

One design choice is worth calling out: we capture the activation once and read it many times. The same snapshot that feeds the SAE also feeds our probes (Family B, the calibrated uncertainty and harm scores). The SAE never re-runs the model; it reads the tensor that generation already produced. That's what keeps a second interpretability view essentially free at inference time.

Few research papers that helped us understand these concepts while building out GlassBox, check em out -
>https://arxiv.org/pdf/2502.03407 
>https://arxiv.org/abs/2601.11516

Now the honest part, because SAEs are easy to oversell. The labels on these features are auto-interpreted, usually by another model and often pulled from Neuronpedia, and they are not reliable. A feature labeled "medical contraindications" might be doing something subtler, or broader, than the label suggests. So in GlassBox the feature cloud is always framed as exploratory. It's the lens you use to ask "huh, why did *that* light up?", not the thing that decides whether an answer is safe. The reliable verdicts come from the calibrated probes, measured against a baseline. SAEs are for exploration, probes are for judgment, and keeping those two roles separate is most of what makes the feature cloud useful instead of misleading.

The least glamorous part mattered the most: making sure the SAE was reading the layer we thought it was. `hidden_states[0]` is the embedding, not the first layer's output, so off-by-one errors are easy and silent. Before trusting anything, we ran a reconstruction check, feeding the captured activation through the SAE and confirming the output matched the input closely by cosine similarity. If that number is low, the SAE and the hook have drifted apart, and every feature you're reading is noise. It's a tiny sanity check that saves you from believing a beautiful, meaningless cloud.

That's the whole pitch for SAEs in production. They turn an opaque vector into something you can actually look at, live, per request. They don't tell you the truth on their own. But paired with calibrated probes and an honest account of their limits, they make a model's thinking visible in a way a clinician can reason about. The hard part was never computing the features. It's deciding what's worth watching, and being honest about how much each view can carry.