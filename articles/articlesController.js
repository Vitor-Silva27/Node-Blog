const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");

router.get("/admin/articles", (_, res) => {
  Article.findAll({
    include: [{ model: Category }],
  }).then((articles) => {
    res.render("admin/articles/index", { articles: articles });
  });
});

router.get("/admin/articles/new", (_, res) => {
  Category.findAll().then((categories) => {
    res.render("admin/articles/new", { categories: categories });
  });
});

router.post("/articles/save", (req, res) => {
  const title = req.body.title;
  const body = req.body.body;
  const category = req.body.category;

  Article.create({
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: category,
  }).then(() => {
    res.redirect("/admin/articles");
  });
});

router.post("/articles/delete", (req, res) => {
  const id = req.body.id;
  if (id != undefined || !isNaN(id)) {
    Article.destroy({
      where: {
        id: id,
      },
    }).then(() => {
      res.redirect("/admin/articles");
    });
  } else {
    res.redirect("/admin/articles");
  }
});

router.get("/admin/articles/edit/:id", (req, res) => {
  let id = req.params.id;
  Article.findByPk(id)
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render("admin/articles/edit", { categories: categories, article: article });
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

router.post("/articles/update", (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;

    Article.update({
        title: title,
        body: body,
        categoryId: category,
        slug: slugify(title)
    },{
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
        console.error(err);
    })

});

router.get("/articles/page/:num", (req, res) => {
    const page = req.params.num;
    const maxArticles = 4;
    const offset = (isNaN(page) || page <= 1)? 0 : (parseInt(page) - 1)*maxArticles;

    Article.findAndCountAll({limit: maxArticles,offset: offset, order: [['id', 'DESC']]})
    .then(articles => {
        const next = (offset + maxArticles >= articles.count) ? false : true;
        const result = {page: parseInt(page), next: next,articles: articles}
        
        Category.findAll().then(categories => {
          res.render("admin/articles/page", {result: result, categories: categories});
        });
    })
})

module.exports = router;
