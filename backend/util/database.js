const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'contacts',
    'admin', 'Admin12345', {
        host: 'contacts-db.clhiqxzszint.us-east-2.rds.amazonaws.com',
        dialect: 'mysql',
        port: 3306,
        logging: console.log,
        maxConcurrentQueries: 100,
        dialectOptions: {
            ssl:'Amazon RDS'
        },
        pool: { maxConnections: 5, maxIdleTime: 30},
        language: 'en'
    });


module.exports = sequelize;