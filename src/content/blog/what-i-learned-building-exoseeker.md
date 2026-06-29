---
title: "What I learned building ExoSeeker"
description: "Lessons from building an AI exoplanet-detection pipeline on NASA Kepler data that hit >90% accuracy and won Best Use of NASA Data."
topic: "ml · nasa"
planted: 2025-11-12
backlinkLabel: "ExoSeeker"
backlinkHref: "https://github.com/Anirudh64210"
---

Check it out here - 
> <a href="https://exoseeker.github.io/" target="_blank" rel="noopener">EXOSEEKER</a>


It started as a hackathon project for the NASA Space Apps Challenge (1st edition in Cincinnati, Ohio) and ended up teaching me more about **feature engineering** than any course did.

Exoseeker is an interactive web platform that demonstrates discovery of exoplanets using authentic Kepler Mission Data and ML models.

## Context

An exoplanet is a planet that exists beyond our solar system. Specifically one with water. Kepler is a NASA Telescope that records data in the space, using KEPLER Object of Interest (KOI) data we predict if a star outside our solar system is an exoplanet or not. Often detected via the **transit method**- where a planet passing in front of it's host star causes a small dip in observed brightness over time.

## The Challenge

The KOI mission data supply light curves of thousands of stars; buried in those are candidate transits. The core challenge is distinguishing true transits from noise, stellar variability and False Positives.

## The Tech

The Kepler light-curve data is noisy and imbalanced - real exoplanets are rare. The wins came from class weighting, careful validation splits, and an ensemble of a PyTorch MLP ( Multi Layer Perceptron) with scikit-learn's HistGradientBoosting rather than chasing a single big model.

We used around 15 predictors for the model, while everyone else did 10. The reseason we chose a lot more is because predicting exoplanets are notorious for **FALSE POSITIVES**. used a hybrid architecture to get the best prediction confidence as possible. We used Transit method but also included key features like temperature and radius data(which are generally ignored)(and more) and also engineered a SNR feature(signal to noise ratio). Host Star means the sun that the potential exoplanet is revolving around. The signal we take is when the exoplanet overlaps with the host star, the Kepler telescope sees a dip in light and measure that signal. To know more about the science behind this, refer to - https://iopscience.iop.org/article/10.1088/0067-0049/206/1/5/pdf

In our pipeline, we first preprocess raw light curve data: detrending, removing outliers, normalizing flux. We engineered features like transit depth, duration, SNR and stellar parameters (temperature, radius). These become input vectors to the model.

Our neural network architecture is a MLP with 3 hidden layers, using ReLU activations, dropout regularization, and batch normalization. We train using binary cross- entropy loss, with early stopping, and k-fold cross-validation to guard against overfitting. Because true transits are relatively rare, we use class weighting (or oversampling) to mitigate class imbalance in training.

Pretty soon we were able to get to ~90% accuracy. compared to a baseline, our model improves recall significantly while keeping FP's manageable.

## The Journey

Users embarked on an intuitive, three-step curiosity-driven journey:search and select stars on a visually stunning 3D star map, view transparent science data including 15 Key planetary parameters, and analyze candidates with a single click to determine their status. We built the site to be a engaging, blending playful sci-fi inspiration from **STAR WARS** and intuitive, easy to understand.

## Fun Fact

After 24 hours, we were supposed to present our project on stage in front of a panel of NASA Engineers, Founders, Tech workers from the Industry. Big stake - big flop xd. Our presentation was not showing up on the projector screen as it should have, so we could take the audience and the panel on the journey i.e. demo our website. We were scrambling for 3 - 4 minutes, and tried to make the projector work, but we didn't want to keep the audience waiting, so we started "demoing" our project without actually being able to present it on stage. Huge Dissapointment, but I was able to explain the unique features we engineered in our model and why how we used the KOI data is better and more accurate. The panel were dissapointed not being able to see the demo on the big screen, but who can we blame right (age old HDMI cables duh). Nevertheless, we convinced the panel about why our architecture stood out and demoed our project on our laptop screen in person with the panel, and the result....

## The Result

> ~90% classification accuracy, Best Use of NASA Data Award.

## If I rebuilt it today

While promising, our approach has limitations.

- The data is noisy and sometimes contains gaps or instrumental artifacts.
- Many false positives arise from stellar variability
- Our MLP-based model may not fully capture temporal patterns in raw time-series.

