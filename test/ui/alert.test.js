'use strict'

const proxyquire = require('proxyquireify')(require)

// need to manually insert the base html which is usually generated in the index.js
// this must happen before alert import because it's immediately self-instantiating (singleton)
// ideally we should extract the html bit from index.js and make preloading easy
const alertNode = document.createElement('div')
alertNode.id = 'alert'
document.querySelector('html').appendChild(alertNode)

// make some stubs, may eventually need to use sinon instead of bare fns to spy on calls
const alertImports = {
  './categories.js': {
    getContent: () => ({
      title: 'a potential Event Loop issue'
    }),
    '@noCallThru': true // proxiquire uses real source by default for fns it cannot resolve in the stubs
  }
}
const alert = proxyquire('../../visualizer/alert.js', alertImports)

// tape instead of tap for compatibility
const test = require('tape').test
// quick hack to prevent doubling of the output
// for debugging use console.info
// proper solution 1: PR karma-tap to use the harness `htest.createStream().pipe()` and redirect output from console.log to window.__karma__.result or similar
// proper solution 2: PR karma-tap to support `verbose: false` flag
console.log = () => {}

// Also note: tried to use tap-pretty but doing so discarded the browserify sourcemaps so decided to drop tap-pretty for now
// consequence of this decision is that we do not get any output from green tests, we only get errors

// same as beforeEach in other frameworks like Mocha and Jasmine
const setup = () => {
  alert.setData({
    analysis: {
      issues: {
        cpu: {},
        memory: {}
      }
    }
  })
  alert.draw()
}

test('alert - renders title', function (t) {
  setup()
  const title = document.querySelector('.title') // alternatively can use d3
  console.info(title) // typical debugging statement, note `info` instead of `log`
  t.ok(title)
  t.strictEqual(title.textContent, 'a potential Event Loop issue')

  t.end()
})
