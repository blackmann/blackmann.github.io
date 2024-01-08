import { Resvg } from '@resvg/resvg-js'
import type { APIRoute, GetStaticPaths } from 'astro'
import satori from 'satori'
import fs from 'fs/promises'
import { getCollection } from 'astro:content'

const regular = await fs.readFile('src/assets/Dosis-Regular.ttf')
const bold = await fs.readFile('src/assets/Dosis-Bold.ttf')
const blogOgBg = await fs.readFile('src/assets/blog-og-bg.base64.txt', 'utf-8')
const logoTagImg = await fs.readFile('src/assets/logo-tag.base64.txt', 'utf-8')
const arrowImg = await fs.readFile('src/assets/arrow.base64.txt', 'utf-8')

export const getStaticPaths = (async () => {
  const posts = await getCollection('blog')
  return posts.map((post) => ({ params: { blogPost: post.slug } }))
}) satisfies GetStaticPaths

export const GET = (async ({ params }) => {
  const post = (await getCollection('blog')).find(
    (post) => post.slug === params.blogPost,
  )

  function title() {
    return {
      type: 'p',
      props: {
        style: {
          fontFamily: 'Dosis',
          color: 'white',
          fontWeight: 700,
          fontSize: 72,
          lineHeight: 1,
          opacity: 1,
        },
        children: post?.data.title,
      },
    }
  }

  function subTitle() {
    return {
      type: 'p',
      props: {
        style: {
          fontFamily: 'Dosis',
          color: 'white',
          fontSize: 40,
          opacity: 0.9,
        },
        children: post?.data.description,
      },
    }
  }

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          background: '#2A2D29',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: `url(${blogOgBg})`,
          padding: '80px 160px 30px',
        },
        children: [blogTag(), title(), subTitle(), footer()],
      },
    },
    {
      width: 1280,
      height: 640,
      fonts: [
        { name: 'Dosis', weight: 400, data: regular },
        { name: 'Dosis', weight: 700, data: bold },
      ],
    },
  )

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1280 } })
  const buffer = resvg.render().asPng()

  const file = new File([buffer], `${params.blogPost}.png`)
  return new Response(file, { headers: { 'Content-Type': 'image/png' } })
}) satisfies APIRoute

function blogTag() {
  return {
    type: 'div',
    props: {
      style: { display: 'flex' },
      children: [
        {
          type: 'div',
          props: {
            style: {
              background: '#fff',
              width: 84,
              height: 40,
              position: 'absolute',
              left: 0,
              top: 10,
              borderRadius: 10,
            },
          },
        },
        {
          type: 'div',
          props: {
            children: '/blog',
            style: {
              background: '#2A2D29',
              border: '3px solid #fff',
              padding: '2px 10px',
              borderRadius: 10,
              color: 'white',
              fontWeight: 700,
              fontSize: 26,
            },
          },
        },
      ],
    },
  }
}

function siteTag() {
  return {
    type: 'div',
    props: {
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              fontSize: 32,
              fontWeight: 700,
              padding: '5px 20px',
              borderRadius: 60,
              alignItems: 'center',
              background: '#41AA4C2E',
            },
            children: [
              {
                type: 'div',
                props: {
                  children: 'degreat.co.uk',
                  style: { color: 'white' },
                },
              },
              {
                type: 'div',
                props: {
                  children: '/blog',
                  style: { color: '#67C571' },
                },
              },
              {
                type: 'img',
                props: {
                  src: arrowImg,
                  height: 20,
                  style: { marginLeft: 15 },
                },
              },
            ],
          },
        },
      ],
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        height: 56,
      },
    },
  }
}

function logoTag() {
  return {
    type: 'img',
    props: {
      src: logoTagImg,
      height: 150,
    },
  }
}

function footer() {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      },
      children: [siteTag(), logoTag()],
    },
  }
}
