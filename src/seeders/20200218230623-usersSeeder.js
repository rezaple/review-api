'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Users', [{
      name: 'John Doe',
      email: 'john.doe@test.com',
      password: await bcrypt.hash('secret', bcrypt.genSaltSync(8)),
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Jane Doe',
      email: 'jane.doe@mail.com',
      password: await bcrypt.hash('secret', bcrypt.genSaltSync(8)),
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
