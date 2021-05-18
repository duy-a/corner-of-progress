<template>
  <article class="py-10 divide-y divide-gray-300">
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
}
</script>
