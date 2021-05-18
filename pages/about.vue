<template>
  <NuxtContent class="prose max-w-none" :document="about" />
</template>

<script>
export default {
  async asyncData({ $content }) {
    const about = await $content('about').fetch()

    return {
      about,
    }
  },
}
</script>
