---
title: Adding dark mode to a blog with Tailwind CSS & Nuxt.js
description:  A step by step guide on how to add a dark mode to a website created with Nuxt.js & Tailwind CSS
createdAt: 2021-06-01
updatedAt: 2021-06-01
slug: adding-dark-mode-to-a-blog-with-tailwindcss-and-nuxtjs
---

**TL;DR**
* [Source code](https://github.com/duy-a/corner-of-progress)
* [Live blog](https://cornerofprogress.com/)

Like all the cool kids on the block, it’s great for a website to have a dark mode. Dark mode can be especially useful for the heavy reading content, as it can reduce the eye strain if the content is read in a dim environment. 

I’ll be adding a dark mode to an already existing blog created with [Nuxt.js](https://nuxtjs.org/) and [TailwindCSS](https://tailwindcss.com/), which was covered in details in the post [Creating a blog with Nuxt.js](https://cornerofprogress.com/creating-a-blog-with-nuxtjs).

## Dark mode logic
There are 2 ways of approaching a dark mode and change the appearance of the website.  Each of them has its pros and cons.

1. A toggle between a dark and light mode
	* Pros: user can easily switch between different modes without ever leaving a website
	* Con: can be a jarring experience if a user has the whole system in dark mode
	
2. Using a system-wide preferences
	* Pros: prevents jarring light content which can be harsh on the eyes
	* Con: difficulty to change the mode if the user wants a light version only for the website

I want a reader to have the best experience possible when reading my blog, so I will be implementing both options. A general flow will be as below:

1. The very first visit to a blog, an appearance will be automatically set to a system-wide presences
2. User can keep it that way or change the mode manually
3. A selection will persist during subsequent visits

## Set up
To enable it,  it is required to set the `darkMode` option in your `tailwind.config.js`. Here, there are two options:
* the `media` option will enable dark mode based on the system-wide preferences
* the `class` option will enable dark mode based on the global class attached to html

Using Tailwind CSS to style your site in dark mode is a breeze and it’s provided out of the box, however, It’s important to note that because of file size considerations, the dark mode variant is **not enabled** in Tailwind by default.

I have set `darkMode` to `class` since having it as `media` gives me zero control.  

```js[tailwind.config.js]
module.exports = {
  darkMode: 'class', // or 'media' or 'class'
}
```

```html
<!-- Dark mode enabled -->
<html class="dark">
	<!-- --->
</html>
```

The implementation of setting a mode will be done with the help of the  [@nuxtjs/color-mode](https://color-mode.nuxtjs.org/) module, which will help us to persist and set a class  to an `html` element. 

```bash
yarn add --dev @nuxtjs/color-mode #npm install --save-dev @nuxtjs/color-mode
```

By default, `@nuxtjs/color-mode` sets a class to `dark-mode` while Tailwind CSS only make changes when the class is `dark`. This discrepancy can be fixed with a simple configuration, basically removing `-mode` suffix.

```js[nuxt.config.js]
export default {
	// other configuration
  buildModules: [
    // other modules
    '@nuxtjs/color-mode',
  ],

  colorMode: {
    classSuffix: '',
  },
}
```

## Styling a website for a dark mode
Creating a dark version of the website is very simple with Tailwind	CSS, all of the styling boils down to adding additional style with a `dark:` prefix, for example:

```html
<div class="bg-white dark:bg-gray-800">
  <h1 class="text-gray-900 dark:text-white">Dark mode is here!</h1>
  <p class="text-gray-600 dark:text-gray-300">
    Lorem ipsum...
  </p>
</div>
```

I won’t go into details in describing how I styled each of the pages, as it is just a matter of adding a dark background and a light text. The actual implementation can be found [here](https://github.com/duy-a/corner-of-progress).

## Switching between modes
During the development, a mode can be easily switched by running the following command in the developer’s console.

```js
$nuxt.$colorMode.preference = 'light' // for light mode
$nuxt.$colorMode.preference = 'dark' // for dark mode
$nuxt.$colorMode.preference = 'system' // switch based on the system wide preference
```

However, this would be a very bad experience for the user. So I created a separate component to handle the logics, cycling between `system`, `dark` & `light`

```vue[components/AppDarkModeToggle.vue]
<template>
  <div class="flex flex-col">
    <button
      v-if="$colorMode.preference === 'system'"
      @click="$colorMode.preference = 'dark'"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        :class="{ 'text-white': $colorMode.value === 'dark' }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    </button>

    <button
      v-if="$colorMode.preference === 'dark'"
      @click="$colorMode.preference = 'light'"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        :class="{ 'text-white': $colorMode.value === 'dark' }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>

    <button
      v-if="$colorMode.preference === 'light'"
      @click="$colorMode.preference = 'system'"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        :class="{ 'text-white': $colorMode.value === 'dark' }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </button>
  </div>
</template>
```

**Note**: all the icons are from [Heroicons](https://heroicons.com/) from the creators of Tailwind CSS. An SVG icon can be easily modified with the tailwind classes

## Dark mode for tailwind typography
If I try to switch the modes now, everything works as intended.  Except there is a small caveat. The style of the posts themselves is unchanged rendering them unreadable.

Post details are being styled with [tailwind typography](https://github.com/tailwindlabs/tailwindcss-typography) using a simple `prose` class. To style this portion of the website, a custom variant `prose-dark` needs to be created, which will be an extension of the `prose` class. 

```js[tailwind.config.js]
module.exports = {
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      typography: (theme) => ({
        dark: {
          css: [
            {
              color: theme('colors.gray.400'),
              '[class~="lead"]': {
                color: theme('colors.gray.300'),
              },
              a: {
                color: theme('colors.white'),
              },
              strong: {
                color: theme('colors.white'),
              },
              'ol > li::before': {
                color: theme('colors.gray.400'),
              },
              'ul > li::before': {
                backgroundColor: theme('colors.gray.600'),
              },
              hr: {
                borderColor: theme('colors.gray.200'),
              },
              blockquote: {
                color: theme('colors.gray.200'),
                borderLeftColor: theme('colors.gray.600'),
              },
              h1: {
                color: theme('colors.white'),
              },
              h2: {
                color: theme('colors.white'),
              },
              h3: {
                color: theme('colors.white'),
              },
              h4: {
                color: theme('colors.white'),
              },
              'figure figcaption': {
                color: theme('colors.gray.400'),
              },
              code: {
                color: theme('colors.white'),
              },
              'a code': {
                color: theme('colors.white'),
              },
              pre: {
                color: theme('colors.gray.200'),
                backgroundColor: theme('colors.gray.800'),
              },
              thead: {
                color: theme('colors.white'),
                borderBottomColor: theme('colors.gray.400'),
              },
              'tbody tr': {
                borderBottomColor: theme('colors.gray.600'),
              },
            },
          ],
        },
      }),
    },
  },
  variants: {
    extend: {
      typography: ['dark'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
```

With the configuration above, now it’s just a matter of adding a `dark:prose-dark` class

```vue[pages/_slug.vue]
<template>
  <NuxtContent
    class="prose dark:prose-dark ..."
    :document="post"
  />
</template>
```

Now switching the modes will update the style of the post themselves. However, the `code`  portions of the post are now having a weird effect. This is caused by a weird default style of the [PrismJS](https://prismjs.com/) package included with [@nuxtjs/content](https://content.nuxtjs.org/). Due to my personal preferences, I decided to apply the dark theme for all the code block.

```bash
yarn add prism-themes #npm install prism-themes
```

```js[nuxt.config.js]
export default {
  modules: ['@nuxt/content'],
  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-material-oceanic.css',
      },
    },
  },
}
```

## Conclusion
Few unexpected issues happened during the implementation of the dark mode. Overall, it took roughly 3 hours to go from an idea to a delivery, which I cannot say about writing this post.

I am very happy with how the dark mode turned out 🤩
