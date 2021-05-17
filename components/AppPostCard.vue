<template>
  <article>
    <dl>
      <dt class="sr-only">Published on</dt>
      <dd class="font-medium text-gray-500">
        <time datetime="2021-04-14T16:01:00.000Z">
          {{ $moment(post.createdAt).format('MMMM DD, YYYY') }}
        </time>
      </dd>
    </dl>
    <div class="space-y-5">
      <h3 class="text-3xl font-bold tracking-tight text-gray-900">
        {{ post.title }}
      </h3>
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
