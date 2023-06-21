---
title: "I did it again. I had to."
description: "Rebuilding my homepage for the 1000th time"
pubDate: "Jun 21 2023"
---

<section>
Every developer/designer has been here a number of times. Some more than others. Me, surely more than everyone 😅. Where is this? Creating another portfolio site. This place is too stressful.

Coming up with a site format that display many aspect of your career and personality is very daunting. Sometimes you start out very ambitious (after being inspired by others); animation + colors + responsiveness coolness. Sometimes, dammit, you want it simple. One column, not too many colors. Fast! And label it as "Web Standards Compliant".

It's hard.

I have kept my previous website for close to two years now. It was built with Docusaurus so I didn't have to worry much about design. Only thing I had to worry about was the homepage, which I believe I killed it — in a simple way. I also did some few style overrides on the content pages and that was it.

The following is a video demo of my old site.
</section>

<video src="/previous-site.mp4" autoplay loop></video>

## Content? Happy?
<section>

But deep down I didn't like Docusaurus entirely. I found myself [swizzling components](https://docusaurus.io/docs/swizzling) so I could override styles or hide some elements, etc. Now this was risky as Docusaurus could publish updates in future which will break things. I don't like uncertain futures like this.

I like control.

The blog and content pages weren't fulfulling my design aesthetics requirements. Achieving what I wanted meant building on top of Docusaurus — remember _swizzling_? That is a huge inconvenience [for me].

Then I found [Astro](https://astro.build). I fell in love with Astro at first sight[^1]. Astro gives you total control. Astro doesn't get in the way. Astro says, bring any frontend framework when you need them.

Isn't that wonderful?

Your project is rendered at build time — into HTML. No hydration things (👀 Docusaurus/React). <span class="text-secondary"> By the way, I prefer Astro to NextJS.</span>

Cool, so I've got the tech. Now the design and the content.

</section>

## This

<section>
Between my previous site and this, I have started and abandoned attempts to redo my site about 6 times. Going crazy, going simple. Going crazy, going simple. I have come to learn that this is as a result of lack of good inspiration, planning and prototyping.

Before setting out to build a site, these three aspects are critical — they form the foundation. In practice, these are actually hard to figure out as there are tremendous amount of inspiration (equally appealing) and planning and prototyping are time consuming.

But this is the formula I've come up with (while maintaining some originality):

### Layout

Layout as you alreay know is the arrangment of [major] content. Choosing a style of layout may demand a level of responsibility in regards to responsiveness. If you don't want to deal with that, you have the option sticking with a single column + max-width page style.

But, if you want something less boring, what you can do is look through a number of sites/inspirations and choose the layout you want. Remember, you're only choosing layout style from these sites/inspirations and not the content itself.

When choosing the layout, be mindful of what will be required in code to achieve them and also if they're immediately practical.

A step further will be to choose different layout styles for different parts of your site from different inspirational sites.

### Components

Using the same formula as the layout, choose (or learn) component styles from another site. For example, how cards, lists, links, buttons, etc. are presented.

Note that, the goal is to come up with just one style to follow.

</section>

[^1]: I wanted to wordplay this as: "I fell in love with Astro at first site". Nevermind!