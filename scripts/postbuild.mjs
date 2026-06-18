import rss from './rss.mjs'
import indexnow from './indexnow.mjs'

async function postbuild() {
  await rss()
  await indexnow()
}

postbuild()
