const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ContactView = sequelize.define('contact-view', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    date:{
        type: Sequelize.DATE,
        allowNull: false
    },
    views_count:{
        type: Sequelize.INTEGER,
        allowNull: false
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

module.exports = ContactView;
