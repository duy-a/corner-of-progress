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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Newer
      </button>
      <button
        class="flex space-x-4 float-right"
        :class="{ 'text-gray-200': currentPage === lastPage }"
        @click="older()"
      >
        Older
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </ul>
</template>

<script>
export default {
  async asyncData({ $content, query }) {
    const totalPosts = (await $content('posts').fetch()).length
    const currentPage = query.page ? +query.page : 1 // it is a string, convert to number
    const perPage = 5
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
  watchQuery: ['page'],
  methods: {
    newer() {
      if (this.currentPage > 1) {
        this.currentPage = this.currentPage - 1
      }

      this.$router.push({ path: '/', query: { page: this.currentPage } })
    },
    older() {
      if (this.currentPage < this.lastPage) {
        this.currentPage = this.currentPage + 1
      }

      this.$router.push({ path: '/', query: { page: this.currentPage } })
    },
  },
}
</script>
