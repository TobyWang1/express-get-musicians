const Band = require('./Band')
const Musician = require('./Musician')

Musician.belongsTo(Band, { foreignKey: 'bandId' })
Band.hasMany(Musician, { foreignKey: 'bandId' })

module.exports = {
    Band,
    Musician
};
