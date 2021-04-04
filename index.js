const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session');
const connection = require("./database/database");


const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/articlesController");
const usersController = require('./users/UsersController');


const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require('./users/User');
//view engine
app.set("view engine", "ejs");

// Sessions
app.use(session({
  secret: "open-sesame",
  cookie: { maxAge: 300000 }
}));



//static
app.use(express.static("public"));

//body parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

//database
connection
  .authenticate()
  .then(() => {
    console.log("Database connection was a success");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/", (_, res) => {
  Article.findAll({
    order: [["id", "DESC"]],
    limit:4
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render("index", { articles: articles, categories: categories });
    });
  });
});

app.get("/:slug", (req, res) => {
  const slug = req.params.slug;
  Article.findOne({
    where: {
      slug: slug,
    },
  })
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render("article", { article: article, categories: categories });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
      console.log(err);
    });
});

app.get("/category/:slug", (req, res) => {
  const slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug,
    },
    include: [{ model: Article }],
  })
    .then((category) => {
      if (category != undefined) {
        Category.findAll().then((categories) => {
          res.render("index", {
            articles: category.articles,
            categories: categories,
          });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
      console.error(err);
    });
});

app.listen(8080, () => console.log("Is running!"));
