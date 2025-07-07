module.exports = {
  apps: [
    {
      name: "NoFraud",
      script: "index.js",
      cwd: "./src/",
      interpreter: "node",
      post_update: ["npm install"],
      env: {
        NODE_ENV: "production",
      },
      autorestart: true,
      out_file: "./logs/NoFraud.out.log",
      error_file: "./logs/NoFraud.err.log",
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    },
  ],
};
