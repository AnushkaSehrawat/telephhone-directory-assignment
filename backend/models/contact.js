const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Contact = sequelize.define('contact', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    first_name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    middle_name:{
        type: Sequelize.STRING
    },
    last_name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
    },
    mobile:{
        type: Sequelize.STRING,
    },
    landline:{
        type: Sequelize.STRING,
    },
    notes:{
        type: Sequelize.STRING,
    },
    created_at:{
        type: Sequelize.STRING,
        allowNull: false
    },
    updated_at:{
        type: Sequelize.STRING,
        allowNull: false
    }

});

module.exports = Contact;
