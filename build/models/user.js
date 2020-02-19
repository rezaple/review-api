'use strict';
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        name: DataTypes.STRING,
        profile_picture: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            }
        },
        password: DataTypes.STRING
    }, {});
    User.associate = function (models) {
        User.hasMany(models.Review, {
            foreignKey: 'user_id',
            as: 'reviews'
        });
    };
    return User;
};
