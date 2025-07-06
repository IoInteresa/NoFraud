const { logsDao } = require("../Dao");

const LogMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", async () => {
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      ip: req.ip,
      headers: req.headers,
      body: req.body,
      responseTime: Date.now() - start,
    };

    await logsDao.addLog(log);
  });

  next();
};

module.exports = LogMiddleware;
