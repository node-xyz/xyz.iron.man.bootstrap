const Iron = require('iron')

function _ironAuthentication (xyz, config) {
  config = config || {}
  let clientRoute = config.clientRoute || 'CALL'
  let clientIndex = config.clientIndex || 0

  let serverIndex = config.serverIndex || 0
  let serverRoute = config.serverRoute || 'CALL'
  let serverPort = config.serverPort || xyz.id().port
  let serverType = config.serverType || 'HTTP'

  const PASSWD = config.PASSWD || 'IRON_MAN_IRON_MAN_IRON_MAN_IRON_MAN_IRON_MAN_IRON_MAN_IRON_MAN_IRON_MAN_IRON_MAN_IRON_MAN_'

  let ironConfig = config.ironConfig || Iron.defaults

  let logger = xyz.logger

  function _ironSealMsg (params, next, end, xyz) {
    let reqConfig = params[0]
    let responseCb = params[1]
    Iron.seal(reqConfig.json, PASSWD, ironConfig, (err, sealed) => {
      if (err) {
        logger.error(`IRON :: error while encrypting message ${err}`)
        responseCb.writeHead(500)
        responseCb.end(`IRON :: error while encrypting message ${err}`)
        end()
      } else {
        reqConfig.json = sealed
        next()
      }
    })
  }

  function _ironHttpUnSealMsg (params, next, end, xyz) {
    let body = params[2]
    Iron.unseal(body, PASSWD, ironConfig, (err, unsealed) => {
      if (err) {
        let resp = params[1]
        logger.error(`IRON [HTTP]:: error while decryping message ${err}`)
        resp.writeHead(401)
        resp.end(`IRON :: error while decryping message ${err}`)
        end()
      }
      logger.silly(`IRON :: message has been unsealed to ${unsealed}`)
      params[2] = unsealed
      next()
    })
  }

  function _ironUdpUnsealMsg (params, next, end, xyz) {
    let json = params[0].json
    Iron.unseal(json, PASSWD, ironConfig, (err, unsealed) => {
      if (err) {
        let resp = params[1]
        logger.error(`IRON [UDP]:: error while decryping message ${err}`)
        end()
      }
      logger.silly(`IRON [UDP] :: message has been unsealed to ${unsealed}`)
      params[0].json = unsealed
      next()
    })
  }

  // client
  console.log(clientRoute)
  xyz.middlewares().transport.client(clientRoute).register(clientIndex, _ironSealMsg)

  // server
  let serverMw = serverType === 'HTTP' ? _ironHttpUnSealMsg : _ironUdpUnsealMsg
  xyz.middlewares().transport.server(serverRoute)(serverPort).register(serverIndex, serverMw)
  logger.info(`IRON :: Iron message encryption created for server [${serverType} @ ${serverPort} route ${serverRoute}] and client [route ${clientRoute}] `)
}

module.exports = _ironAuthentication
