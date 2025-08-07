const crypto = require('crypto');

/**
 * Generate a secure random string for use as JWT secret
 * @param {number} length - Length of the secret (default: 64)
 * @returns {string} - Random string
 */
function generateSecret(length = 64) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex') // convert to hexadecimal format
    .slice(0, length); // return required number of characters
}

// Generate and log a new secret
const secret = generateSecret();
console.log('Generated JWT Secret:');
console.log(secret);
console.log('\nAdd this to your .env file as:');
console.log(`JWT_SECRET=${secret}`);

module.exports = { generateSecret };
