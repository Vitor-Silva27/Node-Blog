const express = require("express");
const router = express.Router();

router.get("/articles", (req, res) => {
    res.status(200).send("Article route");
});

router.get("/admin/articles/new", (req, res) => {
    res.status(200).send("Article creation route");
});

module.exports = router;