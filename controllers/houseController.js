const House = require('../models/houseModel');
const factory = require('./handlerFactory');

exports.createHouse = factory.createOne(House);
