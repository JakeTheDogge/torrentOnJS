'use strict'
import bencode from bencode
import fs from fs 
import tracker from './tracker'

const torrent = bencode.decode(fs.readFileSync('my.torrent'));

tracker.getPeers(torrent, peers => {
    console.log(peers);
})