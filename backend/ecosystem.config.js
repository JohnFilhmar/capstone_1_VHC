module.exports = {
  apps: [
    {
      name: "backend",
      script: "npm",
      args: "run nodemon",
      interpreter: "none",
      watch: true,
    }
  ]
};
