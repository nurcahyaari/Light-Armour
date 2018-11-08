let chance = require('chance').Chance();

let Random = {
    Rand : () => {
        return chance.string({length: 24, pool: 'abcdefghijklmnopestuvwxyz1234567890'})
    }
}

module.exports = Random;