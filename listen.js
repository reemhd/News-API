const app = require("./app.js");
const { PORT = 9090 } = process.env;

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

process.on("SIGTERM", () => {
  debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    debug("HTTP server closed");
  });
});
