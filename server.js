var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

require("./starter/connection")(mongoose);

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Configure middleware

// Routes
// =============================================================
require("./routes/html-routes.js")(app);
require("./routes/author-routes.js")(app);
require("./routes/notes-routes.js")(app);
require("./routes/scraper-routes.js")(app);

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mangocherrypie";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Start the server
app.listen(PORT, function() {
    console.log("App running on port: " + PORT);
  });