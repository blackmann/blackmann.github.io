---
title: 'Optimizing fonts'
description: 'How to reduce font (file) size to load webpages faster'
pubDate: 'Jun 28 2023'
---

As at the time I write this, the total file size for all the fonts I used on my site was about 3MB. This means on slower networks, it took about 5-6 seconds to load. Meanwhile, you'll be looking at a completely loaded page with texts appearing blank.

Thanks to this [StackOverflow answer](https://stackoverflow.com/a/66238793/4803261), I was able to reduce them down to 200KB. Drastic!

## How to

First install `fonttools` with:

```sh
pip3 install fonttools
pip3 install brotli # if you are using .woff/.woff2 formats
```

Now run the following command to optimize the font:

```sh
pyftsubset <font-file-name> --output-file=<font-file-out-name> --unicodes=U+0020-007E
```

The `<font-file-out-name>` should not be the same as the input file name.

`U+0020-007E` is the range sufficient for Basic Latin. In other words, they're enough if your website is in English. If you want to include other character ranges[^1], do something like:

```sh
pyftsubset <font-file-name> --output-file=<font-file-out-name> --unicodes=U+0020-007E,U+00A0-00FF
```

[^1]: Find character ranges here: https://en.wikipedia.org/wiki/List_of_Unicode_characters#Basic_Latin
