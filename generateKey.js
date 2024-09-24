const crypto = require('crypto');
const keyLengthBytes = 16;
const randomKey = crypto.randomBytes(keyLengthBytes).toString('hex');
console.log(randomKey);