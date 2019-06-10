'use strict';
module.exports = (sequelize, DataTypes) => {
  const Books = sequelize.define('Books', {
      title: {
          type: DataTypes.STRING,
          validate: {
              notEmpty: {
                  msg: "You Must Enter a Title."
              }
          },
      },
      author: {
          type: DataTypes.STRING,
          validate: {
              notEmpty: {
                  msg: "You Must Enter a Author."
              }
          },
      },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {});
  Books.associate = function(models) {
    // associations can be defined here
  };
  return Books;
};