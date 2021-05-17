<template>
  <div class="max-w-3xl mx-auto px-4 divide-y divide-gray-200">
    <div class="pt-6 pb-4 text-center">
      <div class="flex items-center justify-center space-x-4">
        <img class="w-12 h-12" src="~/assets/img/logo.png" />
        <h1 class="text-5xl font-extrabold text-gray-900 tracking-tight">
          Corner of Progress
        </h1>
      </div>
      <h2 class="text-xl text-gray-500 mt-2">
        Place of documenting new developments, learnings & discoveries
      </h2>
      <p class="text-xs text-gray-500 mt-3">by Ngac Duy Anh (Ted)</p>

      <nav class="mt-7">
        <ul class="flex items-center justify-center space-x-5">
          <li><NuxtLink to="about" class="nav-link">About</NuxtLink></li>
          <li><NuxtLink to="archive" class="nav-link">Archive</NuxtLink></li>
          <li><NuxtLink to="contact" class="nav-link">Contact</NuxtLink></li>
          <li><NuxtLink to="rss" class="nav-link">RSS</NuxtLink></li>
        </ul>
      </nav>
    </div>

    <main>
      <Nuxt />
    </main>
  </div>
</template>

<style lang="postcss" scoped>
.nav-link {
  @apply font-light text-green-600 hover:text-green-700 underline;
}
</style>
