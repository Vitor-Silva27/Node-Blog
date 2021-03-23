const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require('./database/database');

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/articlesController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");

//view engine
app.set("view engine", "ejs");

//static
app.use(express.static('public'));

//body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))

//database
connection
    .authenticate()
    .then(() => {
        console.log("Database connection was a success")
    }).catch((err) => {
        console.log(err);
    })


app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/", (req, res) => {
    Article.findAll().then(articles => {
        res.render('index.ejs', {articles: articles});     
    })
});

app.listen(8080, () => console.log("Is running!"));