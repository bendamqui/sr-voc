module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        publish: ["github"]
      }
    }
  },
  configureWebpack: {
    externals: {
      sequelize: "require('sequelize')"
    }
  }
};
