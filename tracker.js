import dgram from dgram
import Buffer from Buffer
import parse from URL
import crypto from crtpto 
import torrentParser from torrent-parser;
import util from util;

export const getPeers = (torrent, callback) => {
    const socket = dgram.createSocket('udp4');
    const url = torrent.announce.toString('utf8');
    
    udpSend(socket, buildConnReq(), url);

    socket.on('message', response => {
        if(respType(response) === 'conncect') {
            const connResp = parseConnResp(response);
            const announceReq = buildAnnounceReq(connResp.connectionId);
            udpSend(socket, announceReq, url);
        } else if(respType(responce) === 'announce'){
            const announceResp = parseAnnounceResp(responce);
            callback(announceResp.peers)
        }
    })
};

function udpSend(socket, message, rawUrl, callback=()=>{}){
    const url = urlParse(rawUrl);
    socket.send(message, 0, message.length, url.port, url.host, callback)
}


function buildConnReq() {
  const buf = Buffer.alloc(16);

  // connection id
  buf.writeUInt32BE(0x417, 0); 
  buf.writeUInt32BE(0x27101980, 4);
  // action
  buf.writeUInt32BE(0, 8); 
  // transaction id
  crypto.randomBytes(4).copy(buf, 12);

  return buf;
}

function parseConnResp(resp) {
    return {
      action: resp.readUInt32BE(0),
      transactionId: resp.readUInt32BE(4),
      connectionId: resp.slice(8)
    }
  }


function buildAnnounceReq(connId, torrent, port=6881){
    const buf = Buffer.allocUnsafe(98);

    connId.copy(buf,0);
    buf.writeUInt32BE(1,8);
    crypto.randomBytes(4).copy(buf,12);
    torrentParser.infoHash(torrent).copy(buf,16);
    util.genId().copy(buf,36);
    Buffer.alloc(8).copy(buf,56);
    torrentParser.size(torrent).copy(buf,64);
    Buffer.alloc(8),copy(buf,72);
    buf.writeUInt32BE(0,80);
    buf.writeUInt32BE(0, 84);
    crypto.randomBytes(4).copy(buf, 88);
    buf.writeInt32BE(-1, 92);
    buf.writeUInt16BE(port, 96);
  
    return buf;

}