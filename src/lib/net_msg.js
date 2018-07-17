const msgpack = require('msgpack5')()

const msgindexes = {
  TRACK_ID: '0',
  TIME_STAMP: '1',
  PROGRESS_MS: '2'
}

let netmsg = exports

netmsg.pack = function (msg) {
  var packed = {
    [msgindexes.TRACK_ID]: msg.id,
    [msgindexes.TIME_STAMP]: msg.timestamp,
    [msgindexes.PROGRESS_MS]: msg.progress_ms
  }

  return msgpack.encode(packed)
}

netmsg.unpack = function (msg) {
  var unpacked = msgpack.decode(msg)

  return {
    id: unpacked[msgindexes.TRACK_ID],
    timestamp: unpacked[msgindexes.TIME_STAMP],
    progress_ms: unpacked[msgindexes.PROGRESS_MS]
  }
}
