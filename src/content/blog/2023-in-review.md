---
title: 2023 in review
description: Overall a good year; lessons, opportunities and achievements. A rundown on how it all went.
pubDate: 'Jan 7 2024'
---

This year has mostly been exciting for me. To quantify it, I’ll rate it as a 7/10 or 4/5. While that seems like a positive outlook, they aren’t based on any predefined goals and achievements. In other words, I didn’t have any proper _New Year_ resolutions for 2023. I just winged it.

That must sound reckless, but it’s not as bad as it sounds. We’re mostly used to [wanting to] be organized and follow a plan. But 26 years alive has shown me that plans are at the mercy of external forces. External forces that are mostly beyond our control.

What we do have control of is our preparation for opportunities to come.

I risk digressing further. Let’s talk about 2023.

## Gigs from hell

At the beginning of this year, I was battling depression. I was leading a startup project that was ran by a bunch of inexperienced people that were figuring things out as they went. I was handed a fragile codebase — no tests, duplicated blocks of code, non-RESTful API, no design. Just vibes.

My immediate reaction was: let’s redesign from scratch. This will take about two months. Then we can proceed there. Understandably, this was not what they wanted to hear. Both management and developers. It would seem years of work will be thrown away — sunken cost[^1]. Also “who am I?”. But I went on with it anyways alone. Hoping that my progress will eventually convince them.

> Ask for forgiveness not permission.

[^1]: As people grow older, they tend to look backwards than forwards. They tend to hold on to losses than gains. Of course, rewriting does not guarantee their success. But their current version wasn’t either. The rewrite offered a new chance while making it possible to scale fast.

I was wrong:

#### Today’s developers don’t care about craft

At that time, I had 8 years of coding experience, 5 years professional. The other person with the highest number of years of experience was just about 3 years in and only knows only one language. I assumed they would want to learn from me. I assumed they would care about clean code. I assumed they wanted to release a beautiful[^2] product to their name.

[^2]: Though beauty is subjective, there are some UI/UX/DX conventions most of us have come to prefer.

#### Management wanted to please prospective investors

Let's forget about process. Let's forget about our real customers. Instead, let's get something to show investors for money. That was the recurring theme in every conversation I had with the founder. It was so troubling as I kept getting calls reminding me about an investor meeting about to happen in 2 or 3 days.

This was very frequent; my average heart rate spiked and I could physically feel my heart beating all the time. I slept less. I was declining in health and I could feel it.

My resolve in getting this product ready was founded in the fact that I believed in the idea/project[^3]. I made this clear to the founder a number of times and I think I was blackmailed to deal with the stress.

[^3]: There's always a level of interest I have in the projects I pick up. Else I don't take them.

---

So basically I approached this project using industry standards while applying the lessons I learned from running [Adeton](https://adeton.io). I'm not new to the startup business. I'm also not new to leading a project.

But my values and that of the team were parallel.

I couldn't do it anymore so I sent in my resignation.

Around October (or so), I was contacted by the founder saying their approach to everything couldn't scale and that they'll like to scrap everything and start all over... 😅 Not again!

## Purpose or Money

I value purpose than money. This does not imply I don't like money. Few months towards May 2023, I couldn't find fulfillment in my fulltime job. I craved more creative opportunities but there were none at my former company.

When I say creative opportunities I mean projects where I (or we) work on improving tooling or experiences by building custom solutions. On the contrary, we relied heavily on opensource or SaaS solutions. There were no R&D departments — except that there was a team created to explore machine learning and generative AI towards the end on 2022.

Dont' get me wrong — I'm not saying it's bad to rely on existing solutions. Just that I wasn't happy with what I was doing.

So I resigned. 🌈

## Farming

I wanted to venture into farming. As I write this, I haven't been successful. You may ask what did I want to farm. I am interested in crops that are ready for harvest in a few months. Maize, yam, okro, etc.

I was hyped. See my boots? Moved about a lot trying to get farmlands and to my disappointment, rent rates were very high. The minimum I got was GHS700/acre/year for 10 years minimum at a town down Aburi. That's 7000 cedis per acre. Acquiring 10 acres will cost me 70,000 cedis. This excludes costs like clearing, planting, etc.

I happened to travel to Volta region even. Came back with nothing. Lands are being sold for estates over there.

Besides land cost, another problem is getting a caretaker I can trust since I live in the capital.

<img class="rounded-lg" src="/farm.jpg" width="400" />

## Art + Education

I considered going for an art diploma in Germany. I picked up Duolingo and kept streaks.

<img class="rounded-lg" src="/year_in_review_stats_share_card.jpg" width="400" />

Germany because after exploring a number of European countries on the internet (especially Youtube), they felt like the best option. Learning German felt like a fair challenge and also getting to meet new people just felt exciting.

But after so many days learning German, it didn't look like I was close to the fluency required to take my course. Yupp, I gave the idea up.

> Seems like a year of giving up so far 😅

## Developer tools, opensource

Since I'm jobless, I can freely work on stuff I love or need without constraint of time or expression. This gave birth to:

### Stylebender

I was tired of writing common styles for my web projects. So I built a visual style editor to generate styles. You can try it here: https://stylebender.vercel.app

I worked hard on this for about three weeks. After launch, someone suggested I made exports into Tailwind possible. I initially objected to it because I didn't like Tailwind.

This was because of a past trauma from a terrible developer experience when using Tailwind. This may have been due to webpack on Windows. This was in 2020 thereabouts.

But then, I took it for a spin again. And I loved the experience. I was really happy. I am really happy to have picked it up again. The DX that comes with tailwind is unparalled when it comes to styling.

> Before now, I've mostly used [css modules](https://github.com/css-modules/css-modules).

So stylebender was abandoned.

### 3e

Oh my.

I put 3d into VS Code. The internet was blown away. See [this tweet](https://x.com/_yogr/status/1681344030943199243?s=20)

<a  href="https://x.com/_yogr/status/1681344030943199243?s=20"><img class="rounded-lg" alt="3e Tweet" src="/tweet-1681344030943199243.jpeg" width="400" /></a>

See project here: https://github.com/blackmann/3e

### Mangobase

This is my biggest and active project. A low-code Javascript backend framework. I built this out of the frustration of the new [FeathersJS](https://https://feathersjs.com/) version (v5).

FeathersJS v4 was a beautiful framework until v5 changed everything and made it stressful to add even one service. v4 required me to do very little. v5 required me to do x5.

I needed to move away from it. So I built Mangobase which copies a lot of concepts from Feathers (v4) and includes UI to do low-code stuff.

Check it out here: https://degreat.co.uk/mangobase

There are some Youtube videos here demonstrating how it works: [Mangobase](https://www.youtube.com/playlist?list=PL9GS2OgSAAFJdG4kJtYH_N0ioJBmK7wcG)

### DotLocal

If you're a web developer, there are a number cases where using domain names other than `localhost` is desired. Some instances are:

- Testing cookies
- Resolving tenants using subdomains
- Avoiding conflicting `localstorage` key/values

To address this, I built DotLocal to help replicate production domains (if you will) on local. This way, you don't have to test in production.

Check it out from here: https://degreat.co.uk/dotlocal. Though it's free, consider buying a (one-time) license to support me. 😊

> This is the first tool I ever published with billing and I was thrilled to get 3 sales on the first day of launch.

### bun

I also made notable contributions to the bun runtime. Mainly about Jest implementations:

- https://github.com/oven-sh/bun/pull/2961
- https://github.com/oven-sh/bun/pull/2870
- https://github.com/oven-sh/bun/pull/2836

All merged. 😊

## Diversity of Interests

I thought the conversations we have in our local community can make use of some variety so I introduced a course on 3d modelling with Blender to inspire people to pick up a new skill that can grow into something.

Here's the course: [Introduction to Modeling with Blender](https://www.youtube.com/playlist?list=PL9GS2OgSAAFLqiPzLVhJ1BZ7GqDX47y38)

Though not the _whole world_ picked it up, the few people that did really impressed me. That was nice!

## Fun

I mostly played FIFA with my friends[^4]. One fun thing I did in 2023 was go ride a quad bike in the Eastern Region with some friends. We went through the woods — riding over rocks and climbing hills. Bumpy! It was actually very memorable to me.

[^4]: We normally play against each other in my [Discord server](https://discord.gg/5CDnysz).

<img class="rounded-lg" src="/atv-2023.jpg" alt="ATV Ride" width="400" />

## First public speak

I've lowkey wanted to speak publicly for a long time. Also [@uxderrick](https://twitter.com/uxderrick) encouraged me one time to start speaking. I had the honors to speak at the first [React Ghana](https://twitter.com/ReactGhana) meetup. My topic was: **Diversifying your interests**. I wrote about it here: [/blog/diversify-interests](/blog/diversify-interests)

<img class="rounded-lg" src="/1701689737825.jpeg" alt="React Ghana meetup" width="400" />

## The end

I ended 2023 with a very good state of mind and health. I've had a clear mind for so long, it's a little bit hard to imagine how it once was.

I am happier generally and very positive.

I hope for a better 2024.

See you later!
