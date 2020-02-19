'use strict';
module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define('Topic', {
    name: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {});
  Topic.associate = function(models) {
    Topic.hasMany(models.Review, {
      foreignKey: 'topic_id',
      as: 'reviews'
    });
  };
  return Topic;
};