'use strict';

const bcrypt = require("bcrypt")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
      return queryInterface.bulkInsert("Accounts", [
        {
          email: "test-user@gmail.com",
          password: await bcrypt.hash("test-user", 10),
          name: "test-user",
          createdAt: new Date().toDateString(),
          updatedAt: new Date().toDateString()
        }
      ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('Accounts', null, {})
  }
};
