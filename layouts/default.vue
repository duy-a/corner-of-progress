<template>
  <div
    class="
      flex flex-col
      min-h-screen
      max-w-3xl
      mx-auto
      px-4
      divide-y divide-gray-300
    "
  >
    <div class="pt-6 pb-4 text-center">
      <div class="flex items-center justify-center space-x-3">
        <img class="w-auto h-10" src="~/assets/img/logo.png" />
        <NuxtLink to="/">
          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">
            Corner of Progress
          </h1>
        </NuxtLink>
      </div>

      <p class="text-xs text-gray-500 mt-1">by Ngac Duy Anh (Ted)</p>

      <nav class="mt-7">
        <ul class="flex items-center justify-center space-x-5">
          <li><NuxtLink to="about" class="nav-link">About</NuxtLink></li>
          <li><NuxtLink to="archive" class="nav-link">Archive</NuxtLink></li>
          <li><NuxtLink to="contact" class="nav-link">Contact</NuxtLink></li>
          <li><NuxtLink to="rss" class="nav-link">RSS</NuxtLink></li>
        </ul>
      </nav>
    </div>

    <main class="flex-grow">
      <Nuxt />
    </main>

    <footer class="text-center py-5 text-gray-500 text-sm">
      <p>© 2021–{{ $moment().format('YYYY') }} Ngac Duy Anh</p>
    </footer>
  </div>
</template>

<style lang="postcss" scoped>
.nav-link {
  @apply font-light text-green-600 hover:text-green-700 underline;
}
</style>
