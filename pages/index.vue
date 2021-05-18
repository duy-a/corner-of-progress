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
