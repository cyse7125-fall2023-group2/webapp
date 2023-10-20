const { DataTypes } = require("sequelize");

const createHttpCheckModel = (sequelize) => {
  let httpCheck = sequelize.define(
    "http-check",
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      uri: {
        type: DataTypes.STRING,
        allowNull: false
      },
      is_paused: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      num_retries: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      uptime_sla: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      response_time_sla: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      use_ssl: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      response_status_code: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      check_interval_in_seconds: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      check_created: {
        type: DataTypes.DATE,
        allowNull: false
      },
      check_updated: {
        type: DataTypes.DATE,
        allowNull: false
      },
    },
    {
      updatedAt: "check_updated",
      createdAt: "check_created",
    }
  );

  return httpCheck;
};

module.exports = createHttpCheckModel;
