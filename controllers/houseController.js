const House = require('../models/houseModel');
const factory = require('./handlerFactory');

// Create new guest house
exports.createHouse = factory.createOne(House);
// Get guest house
exports.getHouse = factory.getOne(House);
// Get all  guest house
exports.getAllHouses = factory.getAll(House);
// Delete guest house
exports.deleteHouse = factory.deleteOne(House);
// Update guest house
exports.updateHouse = factory.updateOne(House);
