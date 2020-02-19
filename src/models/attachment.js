'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define('Attachment', {
    review_id: DataTypes.INTEGER,
    path: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});
  Attachment.associate = function(models) {
    Attachment.belongsTo(models.Review,{
      foreignKey: 'review_id',
      as: 'review'
    });
  };
  return Attachment;
};