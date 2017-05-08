# xyz.iron.man.bootstrap
End To End message encryption based on Iron

[![Build Status](https://travis-ci.org/node-xyz/xyz.iron.man.bootstrap.svg?branch=master)](https://travis-ci.org/node-xyz/xyz.iron.man.bootstrap) [![npm version](https://badge.fury.io/js/xyz.iron.man.bootstrap.svg)](https://badge.fury.io/js/xyz.iron.man.bootstrap)
[![dependencies Status](https://david-dm.org/node-xyz/xyz.iron.man.bootstrap/status.svg)](https://david-dm.org/node-xyz/xyz.iron.man.bootstrap)
---

This repository integrates node's [Iron](https://github.com/hueniverse/iron) module to encrypt messages in xyz. It works end-to-end over a given route and port.

# Description

Similar to many other bootstrap function, this module also injects two symmetric middlewares into the system. One will encrypt all messages before going out and the other will decrypt them as soon as they enter.

We can see this in the logs of `console.log(ms)`, where `ms` is an instance of `xyz-core`. If we bootstrap this module with all of the default values, it encrypts the default `CALL` route in client and `CALL` route in the **default server** which lives in port 4000.


```bash
____________________  TRANSPORT LAYER ____________________
Transport:
  outgoing middlewares:
    call.dispatch.mw [/CALL] || _ironSealMsg[0] -> _httpExport[1]
    ping.dispatch.mw [/PING] || _httpExport[0]

  HTTPServer @ 4000 ::
    Middlewares:
    call.receive.mw [/CALL] || _ironHttpUnSealMsg[0] -> _httpMessageEvent[1]
    ping.receive.mw [/PING] || _pingEvent[0]
```

- As you see the `CALL` outgoing route is changed to `_ironSealMsg[0] -> _httpExport[1]`, which encrypts.
- The `CALL` route in `HTTPServer @ 4000` is changed to ` _ironHttpUnSealMsg[0] -> _httpMessageEvent[1]` which decrypts the message before being passed to the service layer.

# Usage

```bash
$ npm install xyz.iron.man.bootstrap
```

will install the module.

Bootstrapping a node with it is as simple as:

```javascript
const IRON = require('xyz.iron.man.bootstrap')

var mathMs = new XYZ({...})

mathMs.bootstrap(IRON, {})
```

where the second argument, `config` have the following keys:

|    option   | default value   | description |
|:-----------:|-----------------|-------------|
| `config.clientRoute`         | 'CALL'            | route of the outgoing route to encrypt       |
| `config.clientIndex`         | 0               | index to insert the client middleware       |
| `config.serverRoute`         | 'CALL'            | route of the server route to decrypt      |
| `config.serverPort`          | `xyz.id().port` | port of the target server      |
| `config.serverIndex`         | 0               | index to insert the middleware      |
| `config.PASSWD`              | see [here](https://github.com/node-xyz/xyz.iron.man.bootstrap/blob/master/xyz.iron.man.bootstrap.js#L13)               | Password used by Iron. should be long and a random string     |
| `config.ironConfig`          | `Iron.defaults`               |  Iron configuration. see [here](https://github.com/hueniverse/iron) for more info      |

Examples and tests are available in the `test` folder. In one of these example, we encrypt a route name `IRON_UDP`. if you run `math.ms` with `debug` logLevel, you will see a similar log:

```bash
[2017-3-31 15:35:5][math.ms@127.0.0.1:4000] debug :: UDP SERVER @ 5000 :: udp message received for /IRON_UDP [{"userPayload":"Fe26.2**a3451a22cfd6eeeb7a13e324457c5afa6751855e6bd7d8b61a0c4574d8a8df53*gMc5pf4S2XcvyD2koP-_RQ*5nK3Dwx7xD8Z10K4O7viGg**8e2f06a044dd26bfefd0a9f471ca9775c7dd6ec500abc5070724f61129baf916*rkLiE5g6OI2Us-7KoZkhPtKubyFiqCyV6gC-USgNAVU","xyzPayload":{"senderId":"127.0.0.1:4000","service":"/math/float/neg","route":"/IRON_UDP"}}]
```

As you see, the `userPayload` portion of the message, wich is all of the data that you pass to the `.call()` is being encrypted.
