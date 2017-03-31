let XYZ = require('xyz-core')
const fn = require('./../../mock.functions')
const IRON = require('./../../../xyz.iron.man.bootstrap')
const sendTo = require('xyz-core/src/Service/Middleware/service.sent.to.target')

var mathMs = new XYZ({
  selfConf: {
    logLevel: 'verbose',
    name: 'math.ms',
    host: '127.0.0.1'
  },
  systemConf: {nodes: []}
})

// HTTP
mathMs.bootstrap(IRON)

// UDP
mathMs.bootstrap(require('xyz-core/src/Bootstrap/udp.tunnel.bootstrap'), {
  route: 'IRON_UDP',
  port: 5000
})
mathMs.bootstrap(IRON, {
  clientRoute: 'IRON_UDP',

  serverRoute: 'IRON_UDP',
  serverPort: 5000,
  serverType: 'UDP'
})

mathMs.register('/math/float/neg', function (payload, XResponse) {
  if (XResponse) {
    XResponse.jsonify('ok whassssaaaap')
  }
})

setInterval(() => {
  // mathMs.call({
  //   servicePath: '/math/float/neg',
  //   sendStrategy: sendTo(mathMs.id().netId),
  //   payload: 'hello'}, (err, body, response) => {
  //   console.log(err, body)
  // })

  mathMs.call({
    servicePath: '/math/float/neg',
    sendStrategy: sendTo(mathMs.id().netId),
    route: 'IRON_UDP',
    redirect: true,
    payload: 'hello'}, (err, body, response) => {
    console.log(`udp ${err} ${body}`)
  })
}, 100)

console.log(mathMs)
