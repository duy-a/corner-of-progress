export default {
  target: 'static',

  publicRuntimeConfig: {
    siteUrl: process.env.BASE_URL || 'http://localhost:3000',
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
        content: process.env.BASE_URL || 'http://localhost:3000',
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
        content: `${process.env.BASE_URL}/og-logo.png`,
      },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '627' },

      // Twitter card
      { name: 'twitter:site', content: '@duy_anh_ngac' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        hid: 'twitter:url',
        name: 'twitter:url',
        content: process.env.BASE_URL || 'http://localhost:3000',
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
        content: `${process.env.BASE_URL}/twitter-card-logo.png`,
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        hid: 'canonical',
        rel: 'canonical',
        href: process.env.BASE_URL,
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
  ],

  modules: ['@nuxt/content'],

  content: {},

  build: {},
}
