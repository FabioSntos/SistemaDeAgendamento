'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'photo_id', {
      type: Sequelize.INTEGER,
      refereces: { model: 'files', key: 'id' },
      onUpdate: '',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {},
};
