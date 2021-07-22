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
