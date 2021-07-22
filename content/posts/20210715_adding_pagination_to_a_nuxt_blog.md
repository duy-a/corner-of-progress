---
title: Adding pagination to Nuxt Blog
description: The list posts is getting longer, and the amount of scrolling is also getting longer. A better solution would be to introduce pagination, displaying a limited number of posts.
createdAt: 2021-07-22
updatedAt: 2021-07-22
slug: adding_pagination_to_a_nuxt_blog
---

**TL;DR:**
- Github: https://github.com/duy-a/corner-of-progress
- Live: https://cornerofprogress.com/

As I add more posts to a blog, the list is getting longer, and the amount of scrolling is also getting longer. A better solution would be to introduce pagination, displaying a limited number of posts.

## Keeping track of page number
There are 2 options available for solving this problem:

1. Using url query: `url/?page=1`
2. Using url params: `url/page/${pageNumber}`

On the surface they will achieve the desired effect, however, if one digs deeper, an issue will surface. A thing to keep in mind is that the whole blog will be statically generated, which means the first method of using URL queries won't play nicely.

To create a second route a simple folder can be created as below:
```
-pages
--pages
---_page.vue // or anything else like _pageNumber.vue
```

With the following structure, a page number can be easily extracted from the URL.

```vue
<script>
export default {
  async asyncData({ $content, params }) {
    console.log(params.page) // a page number
  }
}
</script>
```

## Retrieving posts using `limit()` & `skip()`
The second step is to display a limited amount of posts per page. With a `nuxt-content` it can be achieved simply with `limit()` & `skip()`

```vue[pages/pages/_page.vue]
<script>
export default {
  async asyncData({ $content }) {
    const posts = await $content('posts')
      .only(['title', 'description', 'createdAt', 'slug'])
      .sortBy('createdAt', 'desc')
      .skip(5) // number of posts to skip
      .limit(5) // limit the number of posts to display
      .fetch()

    return { posts }
  },
}
</script>
```

The above will skip the first five posts and will limit to the nuxt five posts, which is great. However, right now, it is hardcoded and nothing will change if we were to navigate to a different page.  A very simple logic to update the navigation between pages and return a correct list of posts.

```vue[pages/pages/_page.vue]
<script>
export default {
  async asyncData({ $content, params, $config }) {
    const totalPosts = (await $content('posts').fetch()).length
    const currentPage = params.page ? +params.page : 1 // it is a string, convert to number
    const perPage = $config.perPage
    const lastPage = Math.ceil(totalPosts / perPage)
    const lastPageCount =
      totalPosts % perPage !== 0 ? totalPosts % perPage : totalPosts - perPage

    const skipNumber = () => {
      if (currentPage === 1) {
        return 0
      }
      if (currentPage === lastPage) {
        return totalPosts - lastPageCount
      }

      return (currentPage - 1) * perPage
    }

    const posts = await $content('posts')
      .only(['title', 'description', 'createdAt', 'slug'])
      .sortBy('createdAt', 'desc')
      .skip(skipNumber())
      .limit(perPage)
      .fetch()

    return { posts, totalPosts, currentPage, lastPage }
  },
}
</script>
```

## Displaying a post list
Once the correct posts are retrieved they have to be displayed. A `pages/index.vue` already have what we want. So I just copied the template. While it can be extracted into a separate component, in this particular case, I don't see myself updating it any time soon.

```vue[pages/pages/_page.vue]
<template>
  <ul class="divide-y divide-gray-300 -mt-10 dark:divide-gray-400">
    <li v-for="post in posts" :key="post.title" class="py-14">
      <AppPostCard :post="post" />
    </li>
  </ul>
</template>
```

Awesome, now if the URL is updated manually to `/pages/1` or `/pages/2`, the list of posts will change accordingly. Simple navigation between pages can be added.

```vue[pages/pages/_page.vue]
<template>
  <ul class="divide-y divide-gray-300 -mt-10 dark:divide-gray-400">
    <li v-for="post in posts" :key="post.title" class="py-14">
      <AppPostCard :post="post" />
    </li>
    <div class="flex justify-between py-5 text-yellow-500">
      <button
        class="flex space-x-4"
        :class="{ 'text-gray-200': currentPage === 1 }"
        @click="newer()"
      >
        &larr; Newer
      </button>
      <button
        class="flex space-x-4 float-right"
        :class="{ 'text-gray-200': currentPage === lastPage }"
        @click="older()"
      >
        Older &rarr;
      </button>
    </div>
  </ul>
</template>

<script>
export default {
  // retrieving posts
  methods: {
    newer() {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1
      }

      if (this.currentPage > 1) {
        this.$router.push({ path: `/pages/${this.currentPage}` })
      } else {
        this.$router.push({ path: '/' })
      }
    },
    older() {
      if (this.currentPage < this.lastPage) {
        this.currentPage = this.currentPage + 1
      }

      this.$router.push({ path: `/pages/${this.currentPage}` })
    },
  },
}
</script>
```

A small note here, is when the page reaches 1 it will navigate to a `pages/index.vue` view instead of `/pages/1` to keep consistency when moving back and forth.

## Redirecting from `/pages` route
Right now, if the user where enter a URL `/pages` it will throw a "Not Found" error. It would be a much better experience if a user is redirected to a home page where the latest posts are..

```vue[pages/pages/index.vue]
<script>
export default {
  middleware({ redirect }) {
    return redirect('301', '/')
  },
}
</script>
```

## Update Home view
While the main purpose of the update, pagination, has been achieved, the blog as a whole is not yet ready from a user experience. Currently, a home page is still displaying all the posts and there is no way for a user to navigate to a different page number from here.

```vue[pages/index.vue]
<template>
  <ul class="divide-y divide-gray-300 -mt-10 dark:divide-gray-400">
    <li v-for="post in posts" :key="post.title" class="py-14">
      <AppPostCard :post="post" />
    </li>
    <div class="flex justify-between py-5 text-yellow-500">
      <button class="flex space-x-4 text-gray-200">&larr; Newer</button>
      <NuxtLink to="/pages/2">
        <button class="flex space-x-4 float-right">Older &rarr;</button>
      </NuxtLink>
    </div>
  </ul>
</template>

<script>
export default {
  async asyncData({ $content }) {
    const posts = await $content('posts')
      .only(['title', 'description', 'createdAt', 'slug'])
      .sortBy('createdAt', 'desc')
      .limit(process.env.PER_PAGE)
      .fetch()

    return { posts }
  },
}
</script>
```

I am using `limit()` to retrieve only the latest posts. Another thing to point out is that I have hardcoded the next page, as it will always be page number 2, so nothing fancy is required.

## Generating routes
If a `nuxt generate` command is run now, there will be a few small problems:

1. Not all posts are being generated
2. No views for the pages are generated

While an automatic nuxt crawler is amazing for dynamic routes, sometimes there is still a need to provide a list of routes.

```js[nuxt.config.js]
const createSitemapRoutes = async () => {
  const routes = []
  const { $content } = require('@nuxt/content')
  const posts = await $content('posts').fetch()

  for (const post of posts) {
    routes.push(`/${post.slug}`)
  }

  const totalPosts = posts.length
  const lastPage = Math.ceil(totalPosts / process.env.PER_PAGE)

  for (let i = lastPage; i > 1; i--) {
    routes.push(`/pages/${i}`)
  }

  return routes
}

export default {
  // other configs
  generate: {
    async routes() {
      return await createSitemapRoutes()
    },
  },
}
```

I already have a method to generate all routes for the posts, so I can simply update it to include the page number routes as well.

## Global variable
Throughout the whole blog post, there is a `.PER_PAGE` variable. It is a simple global variable that will control the number of posts per page.

Like this? [Buy me a coffee](https://www.buymeacoffee.com/duyanhngac)
