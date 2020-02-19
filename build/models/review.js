'use strict';
module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
        topic_id: DataTypes.INTEGER,
        user_id: DataTypes.INTEGER,
        comment: DataTypes.TEXT,
        rate: DataTypes.INTEGER
    }, {});
    Review.associate = function (models) {
        Review.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user'
        });
        Review.belongsTo(models.Topic, {
            foreignKey: 'topic_id',
            as: 'topic'
        });
        Review.hasMany(models.Attachment, {
            foreignKey: 'review_id',
            as: 'attachments',
            onDelete: 'CASCADE'
        });
    };
    return Review;
};
