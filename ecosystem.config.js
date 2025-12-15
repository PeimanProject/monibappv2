const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  apps: [
    {
      name: `${process.env.APP_NAME || 'main'}-Monib-App`,
      exec_mode: "cluster",
      script: "yarn",
      args: `start -p ${process.env.APP_PORT || 5001}`,
      instances: 1,
      interpreter: "bash",
      autorestart: true,
      watch: false,
      max_memory_restart: "800M",
    },
  ],
};
