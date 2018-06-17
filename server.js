const express = require('express');
const morgan = require('morgan');

const app = express();

const blogGetPostRoute = require('./blogControl');
//const blogDelPutRoute = require('./blogDelPut');

app.use(morgan('common'));

//tell app to use created routes
app.use('/blog', blogGetPostRoute);
//app.use('/blog/:id', blogDelPutRoute);

app.listen(process.env.PORT || 8080, () =>  {
    console.log(`listening on port - ${process.env.PORT || 8080}`);
});