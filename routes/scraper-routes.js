var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

module.exports = function(app) {
    // A GET route for scraping the echoJS website
    app.get("/scrape", function(req, res) {
        // First, we grab the body of the html with request
        axios.get("https://www.washingtonpost.com/").then(function(response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            console.log("Cheerio!")
            // Now, we grab every h2 within an article tag, and do the following:
            $("div.moat-trackable").each(function(i, element) {
                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.heading = $(this)
                    .children("div.border-top-off")
                    .children("div.no-skin")
                    .children("div.headline")
                    .children("a")
                    .text();
                result.link = $(this)
                    .children("div.border-top-off")
                    .children("div.no-skin")
                    .children("div.headline")
                    .children("a")
                    .attr("href");
                result.summary = $(this)
                    .children("div.border-top-off")
                    .children("div.blurb")
                    .text();


                // Create a new Article using the `result` object built from scraping
                // console.log("Results: " + JSON.stringify(result));
                db.Article.create(result)
                .then(function(dbArticle) {
                // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    // If an error occurred, send it to the client
                    return res.json(err);
                });
            });

            
            // If we were able to successfully scrape and save an Article, send a message to the client
            res.send("Scrape Complete");
        });
    });
}