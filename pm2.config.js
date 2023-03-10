module.exports = {
  apps: [
    {
      name: 'cronjob',
      script: 'nodemon -q dist/cronjob.js',
    },
  ],
};
