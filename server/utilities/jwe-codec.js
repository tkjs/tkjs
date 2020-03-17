const jwe = require("@adorsys/jwe-codec");

async function encryptPassword(password) {
  const key = {
    kty: process.env.JWE_KTY,
    alg: process.env.JWE_ALG,
    use: process.env.JWE_USE,
    k: process.env.JWE_K
  };

  try {
    const codec = await jwe(key);
    const encrypted = await codec.encrypt(password);
    return encrypted;
  } catch (err) {
    throw err;
  }
}

async function decryptPassword(cipher) {
  const codec = await jwe(key);
  const password = await codec.decrypt(cipher);
  return password;
}

module.exports = { encryptPassword, decryptPassword };
