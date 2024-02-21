module.exports = {
  apps: [
    {
      name: "albison bot",
      script: "./dist/main.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
