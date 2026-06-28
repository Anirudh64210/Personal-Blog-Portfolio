---
title: "What I learned building ExoSeeker"
description: "Lessons from building an AI exoplanet-detection pipeline on NASA Kepler data that hit >90% accuracy and won Best Use of NASA Data."
topic: "ml · nasa"
planted: 2025-01-15
backlinkLabel: "ExoSeeker"
backlinkHref: "https://github.com/Anirudh64210"
---

ExoSeeker started as a hackathon project and ended up teaching me more about **feature engineering** than any course did.

The Kepler light-curve data is noisy and imbalanced — real planets are rare. The wins came from class weighting, careful validation splits, and an ensemble of a PyTorch MLP with scikit-learn's HistGradientBoosting rather than chasing a single big model.

> >90% classification accuracy, Best Use of NASA Data, and a ticket to the global stage.

If I rebuilt it today I'd spend even less time on the model and more on the data pipeline. That's usually where the accuracy is hiding.

*(Placeholder post — replace with your own writing.)*
