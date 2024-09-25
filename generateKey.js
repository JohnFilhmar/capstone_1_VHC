const crypto = require('crypto');
const keyLengthBytes = 50;
const randomKey = crypto.randomBytes(keyLengthBytes).toString('hex');
console.log(randomKey);