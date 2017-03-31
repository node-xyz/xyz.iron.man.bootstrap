const Iron = require('iron')

function _ironAuthentication (xyz, config) {
  config = config || {}
  let clientRoute = config.clientRoute || 'CALL'
  let clientIndex = config.clientIndex || 0

  let serverIndex = config.serverIndex || 0
  let serverRoute = config.serverRoute || 'CALL'
  let serverPort = config.serverPort || xyz.id().port

  const PASSWD = config.PASSWD || 'IRON_MAN_IRON_MAN_IRON_MAN_IRON_MAN_IRON_MAN_IRON_MAN_IRON_MAN_IRON_MAN_IRON_MAN_IRON_MAN_'

  let ironConfig = config.ironConfig || Iron.defaults

  let logger = xyz.logger

  function _ironSealMsg (xSentMessageMwParam, next, end, xyz) {
    let reqConfig = xSentMessageMwParam.requestConfig
    let responseCb = xSentMessageMwParam.responseCallback
    logger.debug(`IRON :: sealing ${JSON.stringify(reqConfig.json)}`)

    Iron.seal(reqConfig.json.userPayload, PASSWD, ironConfig, (err, sealed) => {
      if (err) {
        logger.error(`IRON :: error while encrypting message ${err}`)
        responseCb.writeHead(500)
        responseCb.end(`IRON :: error while encrypting message ${err}`)
        end()
      } else {
        reqConfig.json.userPayload = sealed
        next()
      }
    })
  }

  function _ironUnSealMsg (xMessage, next, end, xyz) {
    let body = xMessage.message.userPayload
    let resp = xMessage.response

    function fail (err) {
      logger.error(`IRON :: error while decryping message :: ${err}`)
      if (resp) {
        resp.writeHead(401)
        resp.end(JSON.stringify({error: `IRON :: error while decryping message ${err}`}))
      }
      end()
    }

    if (typeof (body) !== 'string') {
      fail('message type incorrect')
      return
    }
    Iron.unseal(body, PASSWD, ironConfig, (err, unsealed) => {
      if (err) {
        fail(err)
        return
      } else {
        logger.silly(`IRON :: message has been unsealed to ${unsealed}`)
        xMessage.message.userPayload = unsealed
        next()
      }
    })
  }

  // client
  xyz.middlewares().transport.client(clientRoute).register(clientIndex, _ironSealMsg)

  // server
  xyz.middlewares().transport.server(serverRoute)(serverPort).register(serverIndex, _ironUnSealMsg)
  logger.info(`IRON :: Iron message encryption created for server [ @ ${serverPort} route ${serverRoute}] and client [route ${clientRoute}] `)
}

module.exports = _ironAuthentication
