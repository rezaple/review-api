'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bcrypt = require('bcrypt');
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        return queryInterface.bulkInsert('Users', [{
                name: 'John Doe',
                email: 'john.doe@test.com',
                password: yield bcrypt.hash('secret', bcrypt.genSaltSync(8)),
                createdAt: new Date(),
                updatedAt: new Date()
            }, {
                name: 'Jane Doe',
                email: 'jane.doe@mail.com',
                password: yield bcrypt.hash('secret', bcrypt.genSaltSync(8)),
                createdAt: new Date(),
                updatedAt: new Date()
            }], {});
    }),
    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.
    
          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
    }
};
