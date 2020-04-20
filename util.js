'use strict'

import crypto from crypto;

let id;

export const genId = () => {
    if(!id) {
        id = crypto.randomBytes(20);
        Buffer.from('-DK0001-').copy(id,0)
    } 
    return id;
}