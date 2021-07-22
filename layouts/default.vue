<template>
  <div class="w-full dark:bg-gray-900">
    <div
      class="
        flex flex-col
        min-h-screen
        max-w-3xl
        mx-auto
        px-4
        divide-y divide-gray-300
        dark:divide-gray-400
      "
    >
      <div class="pt-6 pb-4 text-center">
        <div class="flex items-center justify-center space-x-3 relative">
          <div class="absolute top-0 right-0">
            <AppDarkModeToggle />
          </div>
          <img class="w-auto h-10" src="~/assets/img/logo.png" alt="Logo" />
          <NuxtLink to="/" aria-label="Home page">
            <h1
              class="
                text-3xl
                font-extrabold
                text-gray-900
                tracking-tight
                dark:text-gray-100
              "
            >
              Corner of Progress
            </h1>
          </NuxtLink>
        </div>

        <p class="text-xs text-gray-500 mt-1 dark:text-gray-400">
          by Ngac Duy Anh (Ted)
        </p>

        <nav class="mt-7">
          <ul class="flex items-center justify-center space-x-5">
            <li>
              <NuxtLink to="/" class="nav-link" aria-label="Home page">
                Blog
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" class="nav-link" aria-label="About page">
                About
              </NuxtLink>
            </li>
          </ul>
        </nav>
      </div>

      <main class="flex-grow py-10">
        <Nuxt />
      </main>

      <footer class="text-center py-5 text-gray-500 text-sm">
        <p>© 2021–{{ $moment().format('YYYY') }} Ngac Duy Anh</p>
      </footer>
    </div>
  </div>
</template>

<style lang="postcss">
.nav-link {
  @apply text-green-700 hover:text-green-800 underline dark:text-green-500 dark:hover:text-green-400;
}
</style>
