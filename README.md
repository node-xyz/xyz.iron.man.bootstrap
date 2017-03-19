# xyz.iron.man.bootstrap
End To End message encryption based on Iron

[![Build Status](https://travis-ci.org/node-xyz/xyz.iron.man.bootstrap.svg?branch=master)](https://travis-ci.org/node-xyz/xyz.iron.man.bootstrap) [![npm version](https://badge.fury.io/js/xyz.iron.man.bootstrap.svg)](https://badge.fury.io/js/xyz.iron.man.bootstrap)

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
| `config.serverType`          | 'HTTP'          | type of the server identified by `config.serverPort`      |
| `config.serverIndex`         | 0               | index to insert the middleware      |
| `config.PASSWD`              | see [here](https://github.com/node-xyz/xyz.iron.man.bootstrap/blob/master/xyz.iron.man.bootstrap.js#L13)               | Password used by Iron. should be long and a random string     |
| `config.ironConfig`          | `Iron.defaults`               |  Iron configuration. see [here](https://github.com/hueniverse/iron) for more info      |

Examples and tests are available in the `test` folder.
