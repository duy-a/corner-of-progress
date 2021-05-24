---
title: Creating a blog with Nuxt.js
description: Sharing my experience and thought process in creating a blog with Nuxt.js. From developing a blog and making sure that it is fast, responsive and SEO friendly, to deployment without hustle and automation.
createdAt: 2021-05-24
updatedAt: 2021-05-24
slug: creating-a-blog-with-nuxtjs
---

**TL;DR**
* [Source code](https://github.com/duy-a/corner-of-progress)
* [Live blog](https://cornerofprogress.com/)

I have some [Vue](https://vuejs.org/) experience in the past, and I will use it to create a blog. Vue is perfect for creating a Single Page Application (SPA) but is a problem if I want my blog indexed by search engines. 

## Single Page Application (SPA) & Server-Side Rendering (SSR)
SPA means re-rendering the same page based on user input without refreshing a page. User requests a page once and gets back just an empty template, and everything else happens via client-side render using javascript. The benefit of SPA is a better user experience, removing the flashing of a white screen since it eliminates the need to request a new page each time.

![Illustration showing difference between SPA vs Traditional Web](https://cornerofprogress.com/posts/img/spa-vs-traditional-web.png)

However, the search engine crawler is busy & it doesn’t have time to wait for javascript to render content. Crawler takes the first thing it gets from a request and moves on, which means a crawler get an empty document template without content. 

For SPA to play nicely with a search engine crawler, a solution would be to set up server-side rendering (SSR). A first request will be processed on a server and return a document with content already present, similar to a traditional web. Every subsequent interaction by a user will still be handled by a client-side render. And every subsequent crawler’s request is considered as a first request, due to its nature. 

It is a win-win solution for both user & search engine crawler.

![Illustration showing how SSR works](https://cornerofprogress.com/posts/img/ssr-process.png)

Great, so now the solution to the problem is to set up SSR for Vue, but it is a very [cumbersome process](https://ssr.vuejs.org/) and, honestly, not worth the time. Luckily, Vue has an incredible community, and you bet there is a Vue project with properly configured aspects of a production-ready SSR app.

As you might have guessed from a title of a post, such project is [Nuxt.js](https://nuxtjs.org/)

## What is Nuxt.js
> “Nuxt.js is a higher-level framework built on top of the Vue ecosystem which provides an extremely streamlined development experience for writing universal Vue applications.”  

Nuxt is one of the [official recommendations](https://vuejs.org/v2/guide/ssr.html#Nuxt-js) to solve a Vue SSR issue. In fact, Nuxt is providing three ways of rendering:

* Server-side rendering
* Statically generated

Even though SSR would be a solution to a problem, a statically generated website would be a perfect fit for a blog. It means that the content is pre-generated or pre-rendered beforehand as all required files and serve them as it is. There is no need for a server to process a page before serving. 

![Illustration showing Statically generated website works](https://cornerofprogress.com/posts/img/statically-generated.png)

There are many [benefits](https://www.netlify.com/blog/2020/04/14/what-is-a-static-site-generator-and-3-ways-to-find-the-best-one/) to using this approach to build a blog. There are many different solutions to do a statically generated website. However, as I mentioned in my [previous post](https://cornerofprogress.com/opening-code-editor-once-again), creating a blog will be my refresher, and I will use Vue for my next project.

## Setup
/Disclaimer: I am using [yarn](https://yarnpkg.com/) as a package/ dependency manager.

The installation is very simple. I’m using the [create-nuxt-app](https://github.com/nuxt/create-nuxt-app) command to scaffold a Nuxt project with some modules. 

```bash
yarn create nuxt-app blog 
```

It will ask some questions about what dependencies to include and how to configure a project, making sure to select the correct **Rendering mode**  & **Deployment target**.  

|         Rendering mode        | Deployment target |                     Result                    |
|:-----------------------------:|:-----------------:|:---------------------------------------------:|
|        Universal (SRR)        |       Static      |     Pre-renders all the pages with content    |
|        Universal (SRR)        |       Server      | Requires a running server to render a content |
| Single page application (SPA) |   Static/ Server  | No pre-rendering, need to request the content |

Below is my selection:

```bash
? Project name: blog
? Programming language: JavaScript
? Package manager: Yarn
? UI framework: None
? Nuxt.js modules: None
? Linting tools: ESLint, Prettier, StyleLint
? Testing framework: None
? Rendering mode: Universal (SSR / SSG)
? Deployment target: Static (Static/Jamstack hosting)
```

There are few things optional modules I have selected to make my life just a little bit easier. If they are not selected during the installation process, they can be installed later during the development stage. 

After all the options are selected, a command will scaffold project directories & install all the dependencies. Launching and testing an application with the following command. 

```bash
cd blog && yarn dev
```

The application is now running on [http://localhost:3000](http://localhost:3000/).

## Project Directory Structure
Each directory has a purpose. Below is not a full list of directories, but they are the ones that will be used for creating a blog.

* **assets** - Contains your uncompiled assets such as Stylus or Sass files, images, or fonts.
* **components** - Contains Vue.js components. Components are what makes up the different parts of a  page and can be reused and imported into pages, layouts and even other components.
*  **layouts** - Determines a general structure of a page.
* **pages** - Contains application views and routes. Nuxt.js reads all the .vue files inside this directory and automatically creates the router configuration.
* **static** - All included files will be automatically served by Nuxt and are accessible through a project root URL.
* `nuxt.config.js` file - can overwrite & extend default Nuxt configuration

For more details on the directory structure visit [official documentation](https://nuxtjs.org/docs/2.x/directory-structure/nuxt).

## Installing Nuxt modules
Nuxt ecosystem also has incredible support from a community, and it provides a lot of useful modules to make a developer’s life a bit easier. 

I won’t be documenting how to install each of the modules, it is the same for all of them.

```bash
yarn add <nuxt-module>
``` 

Add  `<nuxt-module>` to the `modules` or  `buildModules` (check documentation)  section of `nuxt.config.js`:

```js[server.js]
{
  modules: [
    '<nuxt-module>'
  ],
  <module>: {
    // module's options
  }
}
```

Here is a list of already installed modules:

* [@nuxtjs/eslint-module](https://github.com/nuxt-community/eslint-module) - Find and fix problems in JavaScript code
*  [@nuxtjs/stylelint-module](https://github.com/nuxt-community/stylelint-module) - Find and fix problems in your CSS code
	* Most probably not required as I will be using Tailwind CSS, but it’s nice to have if I ever write some custom CSS
* [Prettier](https://prettier.io/) - Code formatter to ensure consistency across all the files

## Selecting CSS framework
The project will not be complicated and most probably I should just write CSS from scratch. However, I am very interested in trying [Tailwind CSS](https://tailwindcss.com/), a utility-first CSS framework. I keep reading all the good about this CSS framework, and while it looks like an inline styling on a surface, as the creator himself said: “you’re never going to believe me until you actually try it”.  So I will try it. My thoughts on Tailwind CSS is for another post, but now, let’s install it using [@nuxtjs/tailwindcss](https://tailwindcss.nuxtjs.org/) or following instructions on how to [Install Tailwind CSS with Nuxt.js](https://tailwindcss.com/docs/guides/nuxtjs). 

I chose the former way of installation. Additionally, we need to configure Tailwind Css for the gu

Also, I like to clean up a generated project a bit to have a completely blank project, before proceeding any further:
* Remove all the files from the `components` folder
* Remove everything from `index.vue` file
* Remove all the styles from `layouts/default.vue` file

With a blank project and a CSS framework selected, let’s think about what page a blog should have:
* Home page (dynamic) - will display a list of the posts
* Post page (dynamic) - will display the content of a selected post

Before moving on and creating the pages above, all the pages will have one thing in common and that is a navigation bar. So let’s start with that first.

## Creating Navbar
This `layouts/default.vue` dictates the overall layout for all the pages,  so I will update this file. Making sure to include `<Nuxt />` components, where the main content should be rendered.\

At the footer, I am using a [@nuxtjs/moment](https://github.com/nuxt-community/moment-module) module to simplify the work with dates now and in the future. 

```vue[layouts/default.vue]
<template>
  <div
    class="flex flex-col min-h-screen max-w-3xl mx-auto px-4 divide-y divide-gray-300"
  >
    <div class="pt-6 pb-4 text-center">
      <div class="flex items-center justify-center space-x-3">
        <img class="w-auto h-10" src="~/assets/img/logo.png" alt="Logo" />
        <NuxtLink to="/" aria-label="Home page">
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
            Corner of Progress
          </h1>
        </NuxtLink>
      </div>

      <p class="text-xs text-gray-500 mt-1">by Ngac Duy Anh (Ted)</p>

      <nav class="mt-7">
        <ul class="flex items-center justify-center space-x-5">
          <li>
            <NuxtLink to="/" class="nav-link" aria-label="Home page">
              Blog
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="about" class="nav-link" aria-label="About page">
              About
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>

    <main class="flex-grow py-10">
      <Nuxt />
    </main>

    <footer class="text-center py-5 text-gray-500 text-sm">
      <p>© 2021–{{ $moment().format('YYYY') }} Ngac Duy Anh</p>
    </footer>
  </div>
</template>

<style lang="postcss" scoped>
.nav-link {
  @apply text-green-700 hover:text-green-800 underline;
}
</style>
```

## Creating Home page
As mentioned earlier, the home page will display the list of available posts. For now, I will just hardcode everything for structure and styling purposes and will make it dynamic later.

```vue[pages/index.vue]
<template>
  <ul class="divide-y divide-gray-300 -mt-10">
    <li class="py-14">
      <article>
        <dl>
          <dt class="sr-only">Published on</dt>
          <dd class="font-medium text-gray-500">
            <time>
              May 01, 2021
            </time>
          </dd>
        </dl>
        <div class="space-y-5">
          <NuxtLink to="#">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900">
              Title of the post
            </h2>
          </NuxtLink>
          <p class="font-light leading-7 text-gray-500 text-lg">
            Description of the post 
          </p>

          <div class="mt-5">
            <NuxtLink
              to="#"
              class="font-medium text-green-600 hover:text-green-700"
            >
              Details →
            </NuxtLink>
          </div>
        </div>
      </article>
    </li>
  </ul>
</template>
```

Great, I am happy the list is looking, so now let’s refactor it and prepare it for the dynamic content. Firstly, let’s extract the list item into the a separate component for reusability and simplification of code maintenance.
```vue[components/AppPostCard.vue]
<template>
  <article>
    <dl>
      <dt class="sr-only">Published on</dt>
      <dd class="font-medium text-gray-500">
        <time> May 01, 2021 </time>
      </dd>
    </dl>
    <div class="space-y-5">
      <NuxtLink to="#">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900">
          Title of the post
        </h2>
      </NuxtLink>
      <p class="font-light leading-7 text-gray-500 text-lg">
        Description of the post
      </p>

      <div class="mt-5">
        <NuxtLink
          to="#"
          class="font-medium text-green-600 hover:text-green-700"
        >
          Details →
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
```

Now we can update and cleanup `pages/index.vue` file and the result should be the same.
```vue[pages/index.vue]
<template>
  <ul class="divide-y divide-gray-300 -mt-10">
    <li class="py-14">
      <AppPostCard />
    </li>
  </ul>
</template>
```

## Fetching dynamic content with @nuxtjs/content
It is time to figure out where the actual posts will live and how I am going to fetch them. There are multiple ways to do so:

1. Create and maintain the database which will hold all the posts and other information (if required)
2. Use a headless Content Management System (CMS) like [Strapi.io](https://strapi.io/) or [Storyblok](https://www.storyblok.com/)

For a simple blog, a headless CMS would be a perfect solution, however, I don’t want to use another service. Luckily, there is a [@nuxtjs/content](https://content.nuxtjs.org/) module, which will allow storing the post together with the project’s source code. It is simple and will not require a request to a third party service. It allows fetching your Markdown, JSON, YAML, XML and CSV files through a MongoDB like API, acting as a Git-based Headless CMS.

The module requires an additional `content` folder at the root of the project. This is where all the content for the blog will live. To organize the content, all the posts will be under the `content/posts` directory and the content itself will be written in markdown. Let’s create few markdown files and fetch them in our  `pages/index.vue`

```md[content/posts/hello.md]
---
title: hello from nuxt
description: hello from nuxt
createdAt: 2021-05-20
updatedAt: 2021-05-20
slug: hello-from-nuxt
---

# Hello from nuxt
```

A few things to note, a content set between triple-dashed lines must be the first thing in the file, and it will act as meta information in our file. More information on how to write the content can be found [here](https://content.nuxtjs.org/writing/).

Once the files created, it is time to fetch them by updating `pages/index.vue`, where we will fetch using `$content` which is available globally and injected into [the context](https://nuxtjs.org/docs/2.x/internals-glossary/context) of Nuxt.  

```vue[pages/index.vue]
<template>
  <ul class="divide-y divide-gray-300 -mt-10">
    <li v-for="post in posts" :key="post.title" class="py-14">
      <AppPostCard :post="post" />
    </li>
  </ul>
</template>

<script>
export default {
  async asyncData({ $content }) {
    const posts = await $content('posts')
      .only(['title', 'description', 'createdAt', 'slug'])
      .sortBy('createdAt', 'desc')
      .fetch()

    return { posts }
  },
}
</script>
```

The number of items in the list is displaying correctly, however, our `AppPostCard.vue` component still have some hardcoded content and requires content from the parent to change dynamically.

```vue[AppPostCard.vue]
<template>
  <article>
    <dl>
      <dt class="sr-only">Published on</dt>
      <dd class="font-medium text-gray-500">
        <time :datetime="post.createdAt">
          {{ $moment(post.createdAt).format('MMMM DD, YYYY') }}
        </time>
      </dd>
    </dl>
    <div class="space-y-5">
      <NuxtLink :to="post.slug" :aria-label="`Read - ${post.title}`">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900">
          {{ post.title }}
        </h2>
      </NuxtLink>
      <p class="font-light leading-7 text-gray-500 text-lg">
        {{ post.description }}
      </p>

      <div class="mt-5">
        <NuxtLink
          class="font-medium text-green-600 hover:text-green-700"
          :to="post.slug"
          :aria-label="`Read - ${post.title}`"
        >
          Details →
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      requried: true,
      default: () => {},
    },
  },
}
</script>
```

Now the list should be displayed with the correct content pulled from the `content/posts` directory.  I also updated `<NuxtLink />` tags to trigger navigation to the `/slug` route, where the post details are.

## Creating Post page
The route to the post will be dynamic using a slug to retrieve the details. In Nuxt, creating a dynamic page is very simple. All the dynamic routes start with `_` followed by the parameter name, in this case, the file will be `pages/_slug.vue`.

In the `pages/index.vue`, all the information was displayed was meta information. However, to render an actual content of the file, a retrieved file must be passed to the `<NuxtContent />` component.

```vue[pages/slug.vue]
<template>
  <article class="divide-y divide-gray-300">
    <header class="mx-auto text-center pb-10">
      <dl>
        <dt class="sr-only">Published on</dt>
        <dd class="font-medium text-gray-500">
          <time :datetime="post.createdAt">
            {{ $moment(post.createdAt).format('MMMM DD, YYYY') }}
          </time>
        </dd>
      </dl>

      <h2 class="text-5xl font-bold tracking-tight text-gray-900">
        {{ post.title }}
      </h2>
    </header>

    <NuxtContent
      class="mx-auto max-w-none mt-5"
      :document="post"
    />
  </article>
</template>

<script>
export default {
  async asyncData({ $content, params, error }) {
    const post = await $content('posts')
      .where({ slug: params.slug })
      .fetch()
      .catch(() => {
        error({ statusCode: 404, message: 'Page not found' })
      })

    return { post: post[0] }
  },
}
</script>
```

The `<NuxtContent />` will render a file to an html output without any classes,  but it will automatically add a `.nuxt-content` class,  which can be used it to customize a styles:

```css
.nuxt-content h1 {
  /* my custom h1 style */
}
```

Here is the truth, developers are lazy, and I am no exception, and I don’t feel particularly excited to manually style `.nuxt-content` even with the help of Tailwind.  Folks creating a Tailwind thought of this and created a plugin under the name of [tailwind typography](https://github.com/tailwindlabs/tailwindcss-typography)

> Tailwind typography is a plugin that provides a set of prose classes you can use to add beautiful typographic defaults to any vanilla HTML you don’t control (like HTML rendered from Markdown, or pulled from a CMS).  

Now, I can just add a `prose prose-lg` classes to a `<NuxtContent />` and just like that I have a beautifully styled page for displaying posts without writing a single line of CSS code.

```
<NuxtContent
	class="prose prose-lg mx-auto max-w-none mt-5"
   :document="post"
/>
```

## Search Engine Optimization (SEO)
### Meta tags
I am no guru in SEO, however, some simple and SEO work still must be done if I want the blog to be discovered. From the technical perspective, one of the simplest things to do is to add additional meta tags, which will provide additional information about the pages.

Nuxt provides a `head` attribute in the `nuxt.config.js` file which will be injected globally to every page. Here is a good place to start adding all meta tags which should be present on every page.

I will use some basic meta tags for [The Open Graph protocol](https://ogp.me/) & [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/guides/getting-started). The images for the meta tags are placed at the `static/img` directory.

```js[nuxt.config.js]
const siteUrl = process.env.BASE_URL || 'http://localhost:3000'

export default {
  head: {
    title: '',
    titleTemplate: '%s Corner of Progress',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Personal corner on the internet where I share my thoughts on various topics, learnings, new discoveries & development.',
      },
      // OG
      { property: 'og:site_name', content: 'Corner of Progress' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: siteUrl,
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Corner of Progress',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'Personal corner on the internet where I share my thoughts on various topics, learnings, new discoveries & development.',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: `${siteUrl}/img/og-logo.png`,
      },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '627' },

      // Twitter card
      { name: 'twitter:site', content: '@duy_anh_ngac' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        hid: 'twitter:url',
        name: 'twitter:url',
        content: siteUrl,
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Corner of Progress',
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content:
          'Personal corner on the internet where I share my thoughts on various topics, learnings, new discoveries & development.',
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: `${siteUrl}/img/twitter-card-logo.png`,
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        hid: 'canonical',
        rel: 'canonical',
        href: siteUrl,
      },
    ],
  },
}
```

Creating a `.env` file at the root directory will allow storing the website _secretes_ and other dynamic configuration depending on where the site is running.

For the project, there will be only one variable for now, which will dictate what is the website’s url. 

```env[.env]
BASE_URL=
```

### Overwriting global meta tags
For the posts themselves, it would be better to have a relevant specific `title`, `description` and `canonical` values relevant to the content of the post. We can add the `head()` function to the `pages/_slug.vue` to achieve just that.

```vue[pages/_slug.vue
<template>
  <article class="divide-y divide-gray-300">
    <header class="mx-auto text-center pb-10">
      <dl>
        <dt class="sr-only">Published on</dt>
        <dd class="font-medium text-gray-500">
          <time :datetime="post.createdAt">
            {{ $moment(post.createdAt).format('MMMM DD, YYYY') }}
          </time>
        </dd>
      </dl>

      <h2 class="text-5xl font-bold tracking-tight text-gray-900">
        {{ post.title }}
      </h2>
    </header>

    <NuxtContent
      class="prose prose-lg mx-auto max-w-none mt-5"
      :document="post"
    />
  </article>
</template>

<script>
export default {
  async asyncData({ $content, params, error }) {
    const post = await $content('posts')
      .where({ slug: params.slug })
      .fetch()
      .catch(() => {
        error({ statusCode: 404, message: 'Page not found' })
      })

    return { post: post[0] }
  },
  head() {
    return {
      title: `${this.post.title} - `,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.post.description,
        },
        // OG
        { hid: 'og:type', property: 'og:type', content: 'article' },
        {
          hid: 'article:published_time',
          property: 'article:published_time',
          content: this.post.createdAt,
        },
        {
          hid: 'article:modified_time',
          property: 'article:modified_time',
          content: this.post.updatedAt,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${this.$config.baseUrl}/${this.post.slug}`,
        },
        {
          hid: 'og:title',
          property: 'og:title',
          content: `${this.post.title} - Corner of Progress`,
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.post.description,
        },

        // Twitter card
        {
          hid: 'twitter:url',
          name: 'twitter:url',
          content: `${this.$config.baseUrl}/${this.post.slug}`,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: `${this.post.title} - Corner of Progress`,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: this.post.description,
        },
      ],
      link: [
        {
          hid: 'canonical',
          rel: 'canonical',
          href: `${this.$config.baseUrl}/${this.post.slug}`,
        },
      ],
    }
  },
}
</script>
```

### sitemap.xml
Sitemap file is one of the first things a search engine crawler is looking for and should be available at `site-url/sitemap.xml’. This file lists all the available routes belonging to a website. To create a sitemap I will be using a [@nuxtjs/sitemap](https://sitemap.nuxtjs.org/) module.

This module will automatically generate all the static routes such as `pages/index.vue`. However, for the dynamic routes, such as `pages/_slug.vue`, a list of routes must be provided. Generating dynamic routes for the posts will be similar to the way of fetching all the post at `pages/index.vue`.

```js[nuxt.config.js]
const createSitemapRoutes = async () => {
  const routes = []
  const { $content } = require('@nuxt/content')
  const posts = await $content('posts').fetch()

  for (const post of posts) {
    routes.push(post.slug)
  }

  return routes
}

const siteUrl = process.env.BASE_URL || 'http://localhost:3000'

export default {
	// ... other configurations
	modules: [
	  // other modules 	
	  '@nuxtjs/sitemap', // must be placed last
	],
	sitemap: {
    hostname: siteUrl,
    gzip: true,
    routes: createSitemapRoutes,
  },
}
```

### robots.txt
A robots.txt file tells search engine crawlers which pages or files the crawler can or can’t request from your site. This is used mainly to avoid overloading your site with requests. For this, I will use another [@nuxtjs/robots](https://github.com/nuxt-community/robots-module) module, with the following configuration:

```js[nuxt.config.js]
const siteUrl = process.env.BASE_URL || 'http://localhost:3000'

export default {
	// ... other configurations
	modules: [
	  '@nuxtjs/robots'
	],
  robots: [
    {
      UserAgent: '*',
      Allow: '/',
      Sitemap: `${siteUrl}/sitemap.xml`,
    },
  ],
}
```

## Deployment
During the development a `yarn dev` command is used, which spins up a Node.js server. For the production, we can also run the project from the Node.js server using `yarn build && yarn start` command, which will prepare the project for the production environments such as minifying the files, purge unwanted CSS etc. before spinning up a server.

However, as I mentioned earlier, I will be using a statically generated website, which means running a `yarn generate` command instead. This command will also prepare the project for the production environment and then will generate the pages with already populated content. All the generated content can be found at the `dist` directory.

Another important thing is to buy the domain. My personal choice is to buy via [Google Domains](https://domains.google/)

Now everything is ready and it is time to actually deploy and make a blog online. For the hosting platform, I will be using [Netlify](https://www.netlify.com/), which provides an easy way to connect a project via git and redeploy without zero downtime whenever the changes are made.

Configuration is very simple, Netlify provides step by step instructions, all I need is to tell what command to run and what directory to deploy.

I just follow [this tutorial](https://explorers.netlify.com/learn/get-started-with-nuxt/nuxt-generate-and-deploy) and within mere minutes the site is up and accessible via the domain.

## Conclusion
Now I have a running blog, a personal corner on the Internet. Developing a website with [Nuxt.js](https://nuxtjs.org/) was a breeze, the website is extremely fast, responsive and searches friendly thanks to the statically generated functionality. [Tailwind CSS](https://tailwindcss.com/) helps to create a unique style for a website without the hustle of writing a CSS. Using [@nuxtjs/content](https://content.nuxtjs.org/) module simplifies and centralizes where the whole blog lives. And with the deployment on the [Netlify](https://www.netlify.com/), the updates to the post and the website will be almost immediately live with zero downtime.

As the current project stands, the total cost of running this blog is 10 USD/ year, a price of a domain. 

Overall, I am very happy with how the project turned out, and it is time to move to the next “bigger” project.
