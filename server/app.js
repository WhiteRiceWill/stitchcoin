const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const httpApp = express();
const mongoose = require('mongoose');
const http = require('http');
const https = require('https');
const fs = require('fs');
const startSchedule = require('./utils/scheduler.js');

// Config global variables to ENVs
global.leaderboardData = null;
global.productionMode = false;
if (process.env.NODE_ENV === 'production') {
  productionMode = true;
}
global.dbUri = process.env.DB_URI;
global.slackAccessToken = process.env.SLACK_ACCESS_TOKEN;
global.slackVerificationToken = process.env.SLACK_VERIFICATION_TOKEN;

// Initialize server vars
let httpServer = null;
let httpsServer = null;

// Production mode setup
if (productionMode) {
  console.log('STARTING PRODUCTION MODE');

  // SSL options
  const options = {
    key: fs.readFileSync('stitchcoin.key'),
    cert: fs.readFileSync('certificates/stitchcoin.crt'),
    ca: [fs.readFileSync('certificates/gd1.crt'), fs.readFileSync('certificates/gd2.crt')],
  };

  // Create the 2 servers
  httpServer = http.createServer(httpApp);
  httpsServer = https.createServer(options, app);

  // Connect to Mongo DB
  mongoose.connect(dbUri, { poolSize: 50 }, (err) => {
    // Once connected to DB tell servers to listen
    httpServer.listen(8080, () => {
      console.log(`HTTP Express server listening on port ${httpServer.address().port}`);
    });
    httpsServer.listen(3000, () => {
      console.log(`HTTPS Express server listening on port ${httpsServer.address().port}`);

      // Lastly tell pm2 to start
      process.send('ready');
    });
  });

  // pm2 graceful shutdown
  process.on('SIGINT', () => {
    console.info('SIGINT signal received.');

    // Stops http server from accepting new connections and finishes existing connections.
    httpServer.close((err) => {
      // If error, log and exit with error (1 code)
      if (err) {
        console.log(err);
      }
    });

    // Stops https server from accepting new connections and finishes existing connections.
    httpsServer.close((err) => {
      // If error, log and exit with error (1 code)
      if (err) {
        console.log(err)
        process.exit(1);
      }

      // Close mongo connection and exit with success (0 code)
      mongoose.connection.close(() => {
        console.log('Mongoose connection disconnected');
        process.exit(0);
      });
    });
  });

  // For when SIGINT isn't recieved listen for shutdown event and give
  // a little time to finish and close all connections
  process.on('message', (msg) => {
    if (msg === 'shutdown') {
      console.log('Closing all connections...');
      setTimeout(() => {
        console.log('Finished closing connections');
        process.exit(0);
      }, 1500);
    }
  });
}

// Dev mode setup
else {
  console.log("STARTING DEV MODE")

  // set up plain http server
  httpServer = http.createServer(app);

  // Connect to Mongo DB
  mongoose.connect(dbUri, (err) => {
    // Once connected to DB tell servers to listen
    httpServer.listen(5000, () => {
      console.log(`HTTP Express server listening on port ${httpServer.address().port}`);

      // Lastly tell pm2 to start
      process.send('ready');
    });
  });
}

// Redirect http to https
httpApp.get('*', (req, res) => {
  res.redirect(`https://stitchcoin.xyz ${req.url}`);
});

// Redirect www. to the non-www version
app.get('*', (req, res, next) => {
  if (req.hostname.slice(0, 4) === 'www.') {
    const newHost = req.headers.host.slice(4);
    return res.redirect(301, `${req.protocol}://${newHost}${req.originalUrl}`);
  }
  next();
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Parse automatically based on header
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use api route
app.use('/api/', require('./routes'));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname} + '/client/build/index.html`));
});

// Final 404 catch (probably will never reach here now that I have the '*' catch above)
app.use((req, res) => {
  res.status(404).json({ err: { msg: '404 Not Found!' } });
});

startSchedule();
