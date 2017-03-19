const test = require('./../common').test
const expect = require('chai').expect
const _send = test.sendMessage

let processes
let identifiers = []
let TESTER
const TOTAL = 1
before(function (done) {
  this.timeout(15 * 1000)
  test.setUpTestEnv((p) => {
    processes = p
    identifiers = Object.keys(processes)
    TESTER = test.getTester()
    setTimeout(done, 10 * 1000)
  }, 'xyztestrc.json')
})

it('udp and http route secure', function (done) {
  _send('network', processes[identifiers[0]], (data) => {
    console.log(data)
    expect(data.snd).to.above(2)
    expect(data.rcv).to.above(2)
    done()
  })
})

it('tester will mess whith them', function (done) {
  TESTER.call({
    servicePath: '/math/float/neg',
    payload: 'whatever'
  }, (err, body) => {
    expect(err).to.not.equal(null)
    done()
  })
})

after(function () {
  for (let p in processes) {
    processes[p].kill()
  }
})
