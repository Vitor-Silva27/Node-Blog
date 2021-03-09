const express = require("express");
const router = express.Router();

router.get("/articles", (req, res) => {
    res.status(200).send("ROTA DE ARTIGOS");
});

router.get("/admin/articles/new", (req, res) => {
    res.status(200).send("ROTA DE CRIAÇÃO DE ARTIGOS");
});

module.exports = router;