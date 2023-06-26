---
title: "Shape selection for zdog illustrations"
description: "Implementing raycasting for zdog illustration objects"
pubDate: "Jun 23 2023"
---

Quick background:

Few days ago, [@seflless](https://twitter.com/seflless) made a tweet[^1] about a cool _pseudo_ 3D renderer called [zdog](https://zzz.dog). And yupp, I fell into this rabit hole. However, I'm surprised the project has just been given up (for 4 years) — but still looks cool.

[^1]: This is the tweet: https://twitter.com/seflless/status/1671174681410322436


Here's a trailer of how it looks:

<video src="/zdog-trailer.mp4" autoplay loop></video>

You may wonder: why did such a cool project, opensource — could receive community support, didn't make it big like `threejs` for example. Well, I have some assumptions and will share that at the end of this post. For now, here are my intentions for zdog, with the hope that I succeed. I want zdog to be that introductory 3D art experience web developers/designers have before moving on to something more advanced and sophisticated like [Spline](https://spline.design)[^2] or Blender, etc.

[^2]: Spline is to threejs what `zleash` is going to be to zdog

<section>

## zleash

So I want to build an editor where people can compose zdog illustrations. What I found from a Google search was intuitive enough. And just like zdog, it is abandoned. Then after spending some hours in the docs, there was no hint of mouse events or debugging helpers just like we have in threejs.

The API was just bare shapes and canvas. With just one convenience [Dragger](https://zzz.dog/api#dragger).

So the first step is to get mouse event handling added. But before I rush, I needed to make sure no one had already built a solution that I could build on. From roaming through the issues board on Github, there have a number of requests to add mouse events API but the maintainer didn't find it helpful (for the reason he built zdog in the first place). So if anyone wanted, they should go ahead and build it themselves.

Well, some people tried: https://github.com/metafizzy/zdog/issues/75. This thread actually has some interesting ideas on how to approach it.

So it seems, the problem is not solved. It's just ideas all around.

Therefore, I hope to sure my approach to integrating mouse events into zdog with this blog post.

And yes, the name of the editor is going to zleash.

</section>

## The Deal

Given a point `(x, y)`, return a list of shapes that intersect with a line going horizontally through this point. When we have more than one shape, then we'll z-sort and select the closest one[^3].

[^3]: When the user [opt+] clicks again at the same position, thus returning the same set of shapes, we can alternate to the next item in the list.

Note that zdog supports both canvas rendering and SVG rendering. Your choice doesn't really affect the API. Therefore, the implementation for shape selection should work for both render targets. But before I start adding code to zdog's codebase, I need to familiarize myself [properly] with canvas and svg rendering. So I prepared the following applet in that respect.

I had to do this so that I don't get distracted with canvas and svg knowledge gaps while working on zdog. I think it's a good investment.



## Why zdog is dead¿


