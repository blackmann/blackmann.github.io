---
title: 2024 in review
description: "School, farm, work and projects. More importantly, the elections. Great year!"
pubDate: 'Jan 6, 2025'
---

If you don't have time to ready all these stories. Here's a short version:

Top year! Better than the last.

## School

It started like this: December 2023, I went to the cinemas with some friends. While we waited for the show to start there was a commercial about Academic City (University). I was captured by the ad and decided to check them out and possibly enrol. When I checked thier tuition fees, it was above my budget for a 4-year programme especially as I wasn't working at that time.

Then I considered [KNUST](https://knust.edu.gh). Their admission was closing in about 2 days from then; so I quickly put things together and submitted my application. My choice of programmes were mainly centered around Mathematics — I didn't want to read Computer Science as I didn't think it would be that fun, especially with the stories I hear from a lot of friends. My selections were: Mathematics, Statistics, Aerospace Engineering and Computer Science.

Yupp, Computer Science is in there because I had to choose 4 programmes. But I got Statistics finally.

And there my friends, I became a student again at 26 — in the presence of under-20s.

One thing that really bothered me was the lack of community as a university (or at least on a college level). Also the lack of visibility into other departments/colleges. I say this becuase when tech events were happening in College of Engineering for example, I never heard of them or knew where to look.

> I guess the only way was to find reps from the respective colleges and ask them to add me to the communication channels.

In a modern setting, I think a simple/open channel will make things easier. A channel anyone can access and find all they need to know about the school. Communities, locations, events, schedules, library, etc. Being sensitive to problems, I went on to build a solution. I called it [Compa](#compa). Read more about it in the projects section of this review.

Besides the issue of [interconnectivity of people and discipline](/blog/disconnect-of-disciplines), I also realized a lot of people in school didn't know why they were here nor did they know why they're reading a programme. It would seem they were asked to do something they didn't want but had to anyways. What made it easier for them to be in this situation is because everyone else was also doing it.

I got the chance to ask some of my colleagues why they were reading Statistics and all the answers I got were about the "degree", _what else?_. None, no one, told me about the applications of Statistics and what they intend to do with it. Which is crazy! On the other hand, the lecturers are doing a poor job of giving an insight into the applications of our study.

### Coding club

In an attempt to inspire a creative generation, I started a competitive coding club. I sent out some fliers and also decided to recruit some people from Computer Science. But I was utterly disappointed: I went to a class to introduce the idea and everyone stared at me with blank faces as though I spoke a foreign language. It was apparent they had no interest in tech but was in a class that taught it. I left the class with not a single person showing interest.

This really killed my enthusiasm. There wasn't a glimmer of hope.

But then I realized I should find other ways to inspire this change. So I wanted to help people learn — I created a Whatsapp group and asked people to join. Some few people did. I then shared some resources on how and what to learn. After days, I never got even a single comment on the content. Strange!

At this point, it was time to give up. School work and building [USSDK](#ussdk) was already taking enough of my time.

### Outlook

Because I owned a car and maybe how I present myself, I had a number of my colleagues and people from my hostel approach me with sentiments like: "chale, you for show we the way oo". This is funny because they really don't want to know the way! The way, in their minds, would be something fast and big. Something without _honor_. Something requiring minimum effort.

Sorry! But this is about 7 years of hardwork and pain. Sleepless nights and failures. Keeping up with technologies. Preparing for interviews. In between those were those periodic wins and losses. But in the eyes of these people, the imagination is that there must be a shortcut to what they see today.

This form of reasoning is actually warranted as a lot of young people like me exhibit a life of glamor and lavish while openly claiming to have used shortcuts and low efforts to achieve them.

If anyone approaches me thinking like that already, I'm not sure there's much I can do to change their minds.

## Projects

I think I did relatively fewer projects this year. But at the beginning of the year, just when I was enrolled in school, I worked on compa.

### Compa

If you haven't seen it alreay, it's here: [knust.compa.so](https://knust.compa.so). Compa was built to address some community and digital gaps at school. The ideas was basically to have a crowdsourced platform to keep everyone connected with school. It came with features like a forum, aka `Discussions`, events page, library, timetable, marketplace, etc. I spent most of my time besides studies working on this.

There were thousands of visitors every month and most of them used the timetable feature. I only promoted it on Twitter and snapshot. Some friends also helped with promoting it too. With more effort put in promoting it, I think compa can gradually become a thing — a wonderful thing that people will not be able to answer how they lived that long without it.

Compa is also [open source](https://github.com/blackmann/compa), which means anyone can contribute to it. The way compa is designed, any school can download and host one for themselves. Currently, there are instances running for [University of Ghana](https://ug.compa.so) and [UMAT](https://umat.compa.so).

Personally, my favorite feature is the `Discussions`. I think it has the potential to spark insightful conversations and connect people. I've seen it.

![Compa screenshot](/compa-discussions.png)

### USSDK

In 2024, I tried to avoid small projects. So this is another big project I intend to make a business out of.

USSDK is an SDK to build USSD applications. This is a bit technical and only a few people may appreciate what it's about. This project was built to ease the workflow of developers when building USSD applications. If you are curious what USSD is, here you go: You see the code you dial to see your credit balance (`*124#`). That's what's called USSD code. The menu you see and interact with is what's known as a USSD application.

Now building these applications require different paradigm depending on the USSD provider you use. Besides that, the developer experience of putting the menus together is not intuitive.

I was motivated to build USSDK because I had a gig that required me to build a USSD application and I didn't want to go through my former experience of building one.

USSDK allows developers to use a graphical drag/drop interface to build menus and also provides ways to plug in custom API/logic.

I believed the deployment of USSDK will also allow developers to iterate on USSD applications quicker. So here it is: https://ussdk.me

![USSDK](/ussdk-screenshot.png)

USSDK uses a credit system but you get 50 free credits for each application. After that you buy more credits where 1 credit (used per session[^1]) is about 2.5 pesewas.

[^1]: A session is when you dial a USSD code like `*170#` and you go through the menus until the end. That's what a session means.

### Roadman

> This was actually a small project which took a few hours.

[Roadman](https://roadman.degreat.co.uk) is a simple app that allows to plan activities in a mind-mapped manner. Traditional task apps let your outline your todos in a topdown approach. In most cases, we don't have to follow this list in a top down manner — raising a cognitive load of deciding what to do next.

With Roadman, your tasks are composed in a mapped manner. That is, you specify what to do next after each task. And for each task you could also specify the possible next tasks. This way, you're (or at least, I am) not always having scan for what to do next.

You can try it out for yourself here: [Roadman](https://roadman.degreat.co.uk)

## Open source contributions

This year I only made contribution to [Astro](https://astro.build). All contributions had to do with content authoring experience:

- [Bump shikiji, use transformers API, expose transformers API (#astro/9643)](https://github.com/withastro/astro/pull/9643): Astro switched fully to [shikiji](https://shikiji.netlify.app) (now merged back into [shiki](https://shiki.style)) for code syntax highlighting and this came with the benefit of using [transformers](https://shiki.style/guide/transformers) so I added support for those because I needed it. And the rest of the community would too.

## Farming

It's interesting how our world is large and small at the same time. This is going to be whole novel 😅:

In 2023, I met a now close friend called Elikem. In fact, he's the one who met me — and I thank God for that. I was sitting at Vida e Cafe at Accra mall working as usual and this _rasta_ approached me and said "yogarr right? yogarr on Instagram.". So whatever led to what, we happened to rent an apartment together. He eventually introduced me to a friend, Mitul.

It's 2024, I moved to Kumasi for studies. In the second semester, Mitul visited Kumasi on a business trip. He came to visit and introduced me to some of his friends. While we went around getting food and doing random stuff, the boys were [snapping](https://snapchat.com) and posting as usual.

About 2 days later, I was getting out of my car to head for the study room then this big tall guy approaches and asked "You know Charles". "Who?", that's me forgetting the name one of the boys that Mitul introduced to me. However, I did keep his nickname instead. So in an attempt to reconcile who he was talking about, he mentioned Charles' nickname instead. Now he came forth because he saw me on Charles' snaps. And he knows Charles.

This tall guy is Onukpa. From our conversation, he lived around me back in Accra. He also knew one of my friends there. He was also into **farming**!

We kept talking (afterwards) and agreed to send him to go see his farm in the coming weekend. From what I saw and heard, I got my cue to start my farm. Something that [didn't go well in 2023](/blog/2023-in-review#farming). So yeah, turns out I didn't waste my money on those boots 😅.

<img src="/farm-germination.jpeg" width="400"/>

So my friends, what's the likelihood that, I would meet someone in 2023 in Accra, get introduced to some random friend, that random friend comes to Kumasi and introduces me to some random other dudes. These dudes posted our moves on snap and Onukpa sees this and even takes the first move to approach me. And today, I have my first farm.

Onukpa was very helpful in this journey. He helped me acquire the land, the inputs for every stage of the farm in advance, the laborers, etc. He's been there in every stage to guide me. I'm very grateful to have met him.

<img src="/farm-tussle.jpeg" width="400" />

As I write this, harvesting is going on — it's cashout season! I thank God and the Universe for setting this up.

2025, I intend to expand my efforts and possibly plant other crops beside maize 🌽.

## Work

While in school, I had surpassed one year without a job. How I survived with no significant income for over a year was just insane. But the fact that my balance only went down became depressing. That's not sustainable. In an attempt to change that, I decided to invest in [USSDK](#ussdk) and start a company from it. So while in school, I spent an unhealthy amount of time building this thing. I would mostly prioritize working on USSDK than study.

By the time we were done with exams, I had built almost 90% of the project. With the rest being the homepage, documentation and tutorials. The plan was, for the long vacation, I was going to push USSDK hard.

Now it was time to promote the project. I logged on to Twitter after a long time and there in a DM, which was sent 2 weeks prior, was a request for my availability for a fulltime role. I thought I had lost this chance since it's been over 14 days. So I asked if it was still available.

Luckily, yes! I was interviewed for the next two days, got the job and the following week I started.

This was the beginning of a job that had [a combination of all that I asked for](/blog/2023-in-review#purpose-or-money) in my last year's review. I really like it here at [evpin](https://evpin.com). We are a very lean team. Everyday there's a new challenge, like really! I have worked on very cool features; all of which required me to learn something new.

So unfortunately for my initial plans of selling USSDK, I don't get enough time to do that. But it's time will come. All these years have taught me that: time is an ally and patience will redeem.

## Ghana's Election

My biggest concern and interest in 2024 was about the elections. It was very important to me as the current administration did no work in keep the economy stable. At the same time disrespecting the citizens of the country and being outright arrogant. Being elaborate about this would trigger a lot of emotions so I'm going to keep this short. After all, a lot of people don't really care about politics.

The NPP government, that I voted for twice completely abandoned their responsibility to keep an economy stable and thriving and involved themselves in an _unreasonable_ amount of corruption. At the same time rubbing them in our faces. In fact, in their campaign messages, they admit on just cheating to win and wouldn't care much about citizens' votes — which is crazy.

On top of these we had a president who was missing from every conversation regarging the state of the country.

Personally I had a lot of personal reaons against this government:

- Introduction of so many taxes. Tax on Apple store purchases, never-ending covid levy, etc.
- High custom fees
- Worsened exchange rate. Getting worse everyday.
- #StopGalamsey: the government just turned a blind eye to the deteriorating activities of improper mining activities.

Sadly, people already lost faith in an democratic/election system and didn't want to vote. But we are a young democratic country. We were just on our forth administration. We just have lots of lessons to learn and NPP taught us a very big lesson.

But well, [Mahama won](https://3news.com/elections/presidential/)! That's all I want. These people had to go!

## Travel

Okay! This was last minute; more like peer pressure.

24th of December, I flew for Cape Town, SA to join [Peter](https://twitter.com/) and other friends on a vacation. Then on 28th, we all moved to Johannesburg.

Cape Town is just a beautiful city and well structured. One thing that caught me offguard was sunlight. As at 8pm, the sun will still be out like it's 4pm.

<img src="/cpt630.jpeg" width="400" />

This shot was taken at 6.30pm. Like whutt?

It's also very windy where we were. So windy, some trees grow in a certain direction. And then the temperature: cold!

I did enjoy the architecture a lot. The magnificence!

<img src="/cpt3.jpeg" width="400" />
<br />
<img src="/cpt1.jpeg" width="400" />
<br />
<img src="/cpt2.jpeg" width="400" />

Not much to say for Johannesburg as I was indoors most of the time. Why? I was still working. Remember, this trip was last minute so I didn't get to ask for days off. And by the time I close, it's so late to do anything else.

But then: see you again South Africa 🇿🇦!

> It was actually a bad idea to have to come to Johannesburg after Cape Town. Should have been the vise versa.

## What for 25

What are plan for `2025`? This time, I have a few plans:

- Get USSDK into business and make profit.
- Re-attempt talent development programme. This time, just ran competitions. Details on this will come later.
- Try another crop as part of the maize.

And that my friends what `2024`.

Another great year!

On to the next one.