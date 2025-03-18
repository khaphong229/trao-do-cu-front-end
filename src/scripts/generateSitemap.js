import URL_CLIENT from '../config/url_server'
const { SitemapStream, streamToPromise } = require('sitemap')
const fs = require('fs')
const { default: logger } = require('utils/logger')

const pages = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/login', changefreq: 'monthly', priority: 0.4 },
  { url: '/register', changefreq: 'monthly', priority: 0.4 },
  { url: '/survey', changefreq: 'monthly', priority: 0.5 },
  { url: '/management-post', changefreq: 'daily', priority: 0.9 },
  { url: '/profile', changefreq: 'weekly', priority: 0.7 },
  { url: '/post/:id/detail', changefreq: 'daily', priority: 0.9 },
  { url: '/post/category/:category_id', changefreq: 'daily', priority: 0.9 }
]

const sitemapStream = new SitemapStream({ hostname: URL_CLIENT })

pages.forEach(page => sitemapStream.write(page))
sitemapStream.end()

streamToPromise(sitemapStream).then(data => {
  fs.writeFileSync('./public/sitemap.xml', data.toString())
  logger.log('✅ Sitemap generated successfully!')
})
