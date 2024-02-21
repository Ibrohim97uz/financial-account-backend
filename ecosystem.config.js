module.exports = {
  apps: [
    {
      name: 'personal financial accounting',
      script: './dist/main.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
