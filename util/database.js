const Sequelize = require('sequelize');

const sequelize = new Sequelize('expense', 'root', 'psai2670@',
	{
		dialect: 'mysql',
		host: 'localhost'
	});

module.exports = sequelize;