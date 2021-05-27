const createSitemapRoutes = async () => {
  const routes = []
  const { $content } = require('@nuxt/content')
  const posts = await $content('posts').fetch()

  for (const post of posts) {
    routes.push(post.slug)
  }

  return routes
}

const siteUrl = process.env.BASE_URL || 'http://localhost:3000'

export default {
  target: 'static',

  publicRuntimeConfig: {
    baseUrl: siteUrl,
  },

  head: {
    title: '',
    titleTemplate: '%s Corner of Progress',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Personal corner on the internet where I share my thoughts on various topics, learnings, new discoveries & development.',
      },
      // OG
      { property: 'og:site_name', content: 'Corner of Progress' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: siteUrl,
      },
      {
        hid: 'og:title',
        property: 'og:title',
        content: 'Corner of Progress',
      },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'Personal corner on the internet where I share my thoughts on various topics, learnings, new discoveries & development.',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: `${siteUrl}/img/og-logo.png`,
      },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '627' },

      // Twitter card
      { name: 'twitter:site', content: '@duy_anh_ngac' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        hid: 'twitter:url',
        name: 'twitter:url',
        content: siteUrl,
      },
      {
        hid: 'twitter:title',
        name: 'twitter:title',
        content: 'Corner of Progress',
      },
      {
        hid: 'twitter:description',
        name: 'twitter:description',
        content:
          'Personal corner on the internet where I share my thoughts on various topics, learnings, new discoveries & development.',
      },
      {
        hid: 'twitter:image',
        name: 'twitter:image',
        content: `${siteUrl}/img/twitter-card-logo.png`,
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        hid: 'canonical',
        rel: 'canonical',
        href: siteUrl,
      },
    ],
  },

  css: [],

  plugins: [],

  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/moment',
    '@nuxtjs/color-mode',
  ],

  colorMode: {
    classSuffix: '',
  },

  modules: ['@nuxt/content', '@nuxtjs/robots', '@nuxtjs/sitemap'],

  content: {
    markdown: {
      prism: {
        theme: 'prism-themes/themes/prism-material-oceanic.css',
      },
    },
  },

  robots: [
    {
      UserAgent: '*',
      Allow: '/',
      Sitemap: `${siteUrl}/sitemap.xml`,
    },
  ],

  sitemap: {
    hostname: siteUrl,
    gzip: true,
    routes: createSitemapRoutes,
  },

  build: {},
}
