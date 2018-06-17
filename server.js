const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(express.json());


const blogGetPostRoute = require('./blogControl');

app.use(morgan('common'));

//tell app to use created routes
app.use('/blog', blogGetPostRoute);

/*
app.listen(process.env.PORT || 8080, () =>  {
    console.log(`listening on port - ${process.env.PORT || 8080}`);
});
*/

function runServer() {
    const port = process.env.PORT || 8080;
    return new Promise((resolve, reject) => {
      server = app
        .listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve(server);
        })
        .on("error", err => {
          reject(err);
        });
    });
  }

  function closeServer() {
    return new Promise((resolve, reject) => {
      console.log("Closing server");
      server.close(err => {
        if (err) {
          reject(err);
          // so we don't also call `resolve()`
          return;
        }
        resolve();
      });
    });
  }

  if (require.main === module) {
    runServer().catch(err => console.error(err));
  }
  
  module.exports = { app, runServer, closeServer };