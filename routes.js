function generateRoutes(app) {
  const pagesRouter = require("./pages");
  app.use("/", pagesRouter);
}
module.exports = { generateRoutes };
