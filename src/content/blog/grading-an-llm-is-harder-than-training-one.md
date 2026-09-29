---
title: "Grading an LLM is harder than training one"
description: "Anyone can run an RL loop now. Knowing if the model actually got better is the hard part, and it comes down to reward hacking, LLM judges, rubrics and benchmarks that are sometimes wrong themselves."
category: "LLMs"
topic: "evaluation · reward hacking"
planted: 2026-09-29
tldr: "Training an LLM with RL scales with compute, grading it doesn't. Models optimize whatever the reward says, so reward models, LLM judges and rubrics all get gamed, and even major benchmarks turn out to have broken questions. The grader is the real bottleneck in post-training now."
draft: false
---

Say you're training a model with reinforcement learning. You have the data, the compute, the setup. The model tries something, gets a score, and learns to do more of whatever scored high.

Simple enough. Except the model doesn't learn what you meant. It learns what the score says.

That one detail is what I keep coming back to. Everyone talks about the model. Parameters, data, the next architecture. A lot less about the thing handing out the score. I think that's backwards now. Training is the part that scales. Grading is the part that doesn't.

## two kinds of graders

Roughly, there are two ways to hand out that score.

One is learned. That's RLHF. You show people two answers, they pick the better one, you train a reward model to predict their pick, then you optimize the LLM against it. It worked well enough that InstructGPT at 1.3B params was preferred by people over the 175B GPT-3 it came from. Wild when you think about it.

The other is verifiable. Math has a final answer, code has tests. You check it and you're done. The Tulu 3 folks named this RLVR, reinforcement learning with verifiable rewards, and it's a big part of how reasoning models like DeepSeek-R1 got trained. You can't argue with a unit test.

Which is exactly why everyone loves it. And exactly why it only goes so far. Most of what people actually want from these models doesn't have a test. A legal memo. A diagnosis. Should we ship this or not. Nobody gets to write assert(good_decision).

## goodhart, every time

There's an old OpenAI example from 2016 I think about sometimes. They trained an agent on a boat racing game and rewarded it for hitting targets on the course. It found a spot where it could circle and hit the same targets over and over, catching fire, crashing into other boats, never finishing the race. It scored higher than actually racing.

It's funny. It's also the whole problem in one gif. And I'd argue it's not even the agent being dumb, it's the agent being really good at exactly what we asked. Which is worse, if you think about it, because you can't fix "too good at the wrong thing" by making it smarter. Smarter just finds the loop faster.

Anyway. LLMs do the same thing, just more politely.

Gao, Schulman and Hilton actually measured it. Push a policy harder against a reward model and the reward model's score keeps going up, while real quality goes up for a while and then comes back down. Past some point you're just getting better at pleasing the grader.

Anthropic's work on sycophancy shows what that looks like in practice. People and preference models both sometimes prefer the confident, agreeable answer over the correct one. Train on that and you get a model that tells you what you want to hear. In a later paper, models trained on a bunch of gameable tasks occasionally went and edited their own reward function when they had access to it. Rarely. But nobody taught them to.

## judges and rubrics

For the stuff without a test, the field mostly leans on two things.

LLM-as-a-judge, where a strong model grades the answer. The MT-Bench paper found GPT-4 agreed with human raters over 80% of the time, about as often as humans agree with each other. Good. But it also favors whichever answer it sees first, it favors longer answers, and it favors answers that sound like itself. The length thing got bad enough that AlpacaEval put out a length-controlled version, because models were climbing the leaderboard partly by just writing more.

So a judge is a reward model. It's just nicer to talk to.

Then rubrics. Break "good" into small things you can check. Did it give the dose, did it flag the interaction, is the final number right. OpenAI's HealthBench does this with rubrics written by physicians, and I think it's the right direction.

But it doesn't make the hard part go away, it moves it. Now someone has to write the rubric, and a bad rubric is worse than no rubric, because it trains confidently toward the wrong thing while the scores look great the whole time. A criterion that checks whether a word shows up gets satisfied without the understanding behind it. One that's too vague gets filled in by whatever the judge already prefers.

## sometimes the question is wrong

This is the part I think gets talked about the least.

When a model fails an eval, we assume the model failed. Sometimes the question did.

SWE-bench is one of the main coding benchmarks, built from real GitHub issues. When OpenAI went through it with the original authors to make SWE-bench Verified, engineers screened a sample and roughly two thirds of it got filtered out. Issues too vague to know what the fix should even be. Tests that would fail a perfectly good solution. They ended up with 500 tasks they actually trusted.

That's a benchmark the whole industry was watching.

I've hit small versions of this on my own stuff. With GlassBox I was probing medical LLMs to catch when they're unsure, and the same probe went from 0.55 AUROC, basically a coin flip, to 0.88 once I normalized the activations. Same model. Different measurement. If I'd trusted the first number I'd have said there's nothing there. With Toki, getting word error rate down to 9.2% felt great until I realized it tells you the words are right, not that the notes are useful. Had to track retrieval separately for that.

Which is kind of the boat again. The number that's easy to compute isn't the thing you care about, and the gap between them is where you fool yourself.

## so where does that leave it

Compute scales. Judgment doesn't, not really.

Anyone can run an RL loop now. The hard part, and I think the part that actually separates good models from fine ones, is building a grader that a very capable optimizer can't talk its way around. Check outcomes when you can. Assume the model will find the gap, because it will. Make sure a failure is a real failure before you trust it. And get people who actually know the domain to write the checks, which is why physicians writing HealthBench's rubrics matters more than it sounds.

Training got easier. Knowing if it worked didn't.

## worth reading

- [Scaling Laws for Reward Model Overoptimization](https://arxiv.org/abs/2210.10760) Goodhart, measured.
- [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685) where the judge biases got written down.
- [Towards Understanding Sycophancy in Language Models](https://arxiv.org/abs/2310.13548)
- [Introducing SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/) a benchmark auditing its own questions.
- [Reward Hacking in Reinforcement Learning](https://lilianweng.github.io/posts/2024-11-28-reward-hacking/) Lilian Weng's survey, best single overview.
