<template>
  <div>
    <NuxtContent class="prose mx-auto" :document="post" />
  </div>
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
