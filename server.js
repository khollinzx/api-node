// Require the initial env
require('dotenv').config();
require('dotenv').config({path: '.env'});

// Require the app
const app = require("./src/app");

// Require the app url and port configuration
const { url, port, enviroment } = require("./config/server.config");

// Start the server
app.listen(port, () => console.log(`Plentywaka API server started on ${enviroment}: ${url}:${port}`));
// app.listen(PORT,() => {
//     console.log(`Server is connected to PORT ${PORT}`)});