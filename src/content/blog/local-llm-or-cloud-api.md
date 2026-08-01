---
title: "The crossroads: local LLM or cloud API"
description: "Cloud models are faster and smarter, local models keep your data yours. Thoughts on the tradeoff from someone stuck at that crossroads, and why privacy isn't the argument."
topic: "llms · application layer"
planted: 2026-08-01
ogImage: "/og/local-llm-or-cloud-api.png"
---

Say you want to build an application that uses an LLM's intelligence to give out outputs. The question comes up almost immediately. Do we use a cloud based model, or a local one?

I've been working on an AI project in the application layer with a fellow founder over at <a href="https://studiomaydit.com" target="_blank" rel="noopener">Studio Maydit</a>, where him and his team design some seriously cool stuff. It's a work in progress, but we were at this exact crossroads ourselves, and I have been thinking about it for a while.

Lightweight models are getting heavily commoditized, and they're getting strong. The possibilities are high. That said, there's still a clear and undeniable difference in the quality of outputs between smaller param local models and the mega large LLMs served via the cloud, Claude and ChatGPT being the biggest of them all.

<div class="logos">
  <img src="/logos/anthropic.svg" alt="Anthropic" width="26" height="26" loading="lazy" />
  <img src="/logos/google.svg" alt="Google" width="26" height="26" loading="lazy" />
  <img src="/logos/meta.svg" alt="Meta" width="26" height="26" loading="lazy" />
  <img src="/logos/qwen.svg" alt="Qwen" width="26" height="26" loading="lazy" />
  <img src="/logos/ollama.svg" alt="Ollama" width="26" height="26" loading="lazy" />
  <span class="cap">LLM models</span>
</div>

The tradeoff is in privacy. When an application uses a cloud based model to put out a result, it shares your information to get that output. It's not yours.

Most people seem okay with giving up a part of their privacy and their data, because the value provided and the seamlessness is addicting.

Trade that off with a local LLM embedded into your desktop application build. In simple words, the model lives on your computer. Possible because it's small, generally. Your data goes to the model that's on your computer, and it gives you the output. Everything you need is processed on your computer. Input, output, data, all of it stored locally. And the cool part about it is, cloud needs a connection, local doesn't.

Wouldn't you want that? Of course you'd want that.

## the difference

What these large LLMs are amazing at is throughput, the sheer number of tokens they push per second, and the quality of what comes out. Whereas say if I decide to build an application with a local lightweight LLM, I'm bound by the machine it runs on. VRAM or unified memory decides which model even fits. Quantization decides how much quality I trade away to make it fit. And memory bandwidth, not raw compute, is what caps tokens per second after that. And these smaller param models are good at giving quality outputs, especially text generation. Not great. But it gets the job done.

<div class="logotiles">
  <span class="logotile" style="background:#D97757"><img src="/logos/claude.svg" alt="" width="15" height="15" loading="lazy" />Claude</span>
  <span class="logotile" style="background:#4285F4"><img src="/logos/google.svg" alt="" width="15" height="15" loading="lazy" />Gemma</span>
  <span class="logotile" style="background:#0467DF"><img src="/logos/meta.svg" alt="" width="15" height="15" loading="lazy" />Llama</span>
  <span class="logotile" style="background:#6950EF"><img src="/logos/qwen.svg" alt="" width="15" height="15" loading="lazy" />Qwen</span>
  <span class="logotile" style="background:#000000"><img src="/logos/ollama.svg" alt="" width="15" height="15" loading="lazy" />Ollama</span>
  <span class="cap">Claude sits on the cloud side. Gemma, Llama and Qwen you can download and run yourself.</span>
</div>

Worth being specific about where the small ones fall short, because it isn't random. There's no memory beyond what you fit back into the context every turn, and smaller models are bad at holding that thread, so a few turns in it has lost what you were doing. They cap out on multi-step reasoning: proper logic, calculus, anything where you have to carry several steps at once. And they're badly calibrated about it, so confidence doesn't drop when accuracy does and you get a confident wrong answer rather than a loud failure. And large processing is out. Give one a long document and quality drops well before the context window says it should. The effective context is always shorter than the advertised one. Mundane tasks, fine. Hard ones, not really.

## ownership

I think people should care more about ownership, and control over your experience when you use these applications.

Think of a genie in everyone's hands. Free, good enough for the mundane tasks and questions, no network needed for any of it. Nobody metering it, nobody logging it.

As open source models get stronger and stronger, smaller param models can get smarter. You cannot deny the amazing power of these billion and trillion param models, but the world is moving towards a place where people seek ownership, privacy, clarity, satisfaction, taste, personalisation.

But then again.

<p class="shout">Privacy is what people say they want, not what they do.</p>

Ask anyone if they'd like their data to stay on their own machine and it's yes, every time. Then watch what they actually install.

People care, but people care more about least effort. Seamlessness, ease. And cloud does exactly that very well, not bound to your hardware at all. You can run a heavy query on your phone, it gets processed on the cloud and the result is back in a second. That just cannot possibly be done if the model was on the phone itself. And that is exactly the kind of thing an average joe doesn't want to think or care about.

## so which one

The decision should be based on what works best for your case, if you're building an application that harnesses a model's power.

The cost. How long a user can wait for the output without getting sick of it. Privacy. Whether it has to work without a connection. What hardware you're willing to ask people to have. Etc, etc.

There are improvements on the privacy side for cloud now: HIPAA business associate agreements, SOC 2 reports, GDPR data processing agreements, zero data retention options. None of it makes the data yours, but it makes the objection harder to hold up.

And as token costs get lower, it becomes very lucrative for businesses to build on top of the big models, because the tradeoff in quality and cost is worth the little squeeze in privacy.

So, simply put. Use cloud if your application needs real processing and compute power, or does genuinely complex tasks. Long documents, multi-step reasoning, anything where a wrong answer actually costs somebody something. That's what the big models are for, and nothing running on a laptop is going to match them there.

Go local when the work is mundane. Summarising, rewriting, tagging, extracting, cleaning up text. The small repetitive stuff that is honestly most of what people use these things for day to day. There's a thin but growing layer of applications now that bundle a small model and do exactly that, and they never have to phone home once. And it will definitely evolve in the complexity of tasks they can handle, as these models evolve.

What I'm most curious about is still the fully local, full ownership applications. I think there's a very big untapped area for local LLM application experiences that's yet to be explored, and it'll definitely be interesting to see how it pans out.

## worth reading

Few things that are a good read if you want to think about this further -

<ul class="readlist">
  <li><a href="https://arxiv.org/abs/2404.14219" target="_blank" rel="noopener">Phi-3 Technical Report: A Highly Capable Language Model Locally on Your Phone</a></li>
  <li><a href="https://arxiv.org/abs/2407.21075" target="_blank" rel="noopener">Apple Intelligence Foundation Language Models</a><span>what it takes to ship an on-device model in production.</span></li>
  <li><a href="https://simonwillison.net/tags/local-llms/" target="_blank" rel="noopener">Simon Willison on local LLMs</a><span>best running log of what's actually possible on a laptop right now.</span></li>
  <li><a href="https://github.com/ggml-org/llama.cpp" target="_blank" rel="noopener">llama.cpp</a> and <a href="https://github.com/mozilla-ai/llamafile" target="_blank" rel="noopener">llamafile</a><span>llamafile ships a whole model as one executable file.</span></li>
  <li><a href="https://github.com/mlc-ai/web-llm" target="_blank" rel="noopener">WebLLM</a> and <a href="https://developer.chrome.com/docs/ai/built-in" target="_blank" rel="noopener">Chrome's built-in AI</a><span>local inference in a browser tab, no install at all.</span></li>
</ul>
