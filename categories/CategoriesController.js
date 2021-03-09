const express = require("express");
const router = express.Router();

router.get("/categories", (req, res) =>{
    res.send("Categories rout");
});

router.get("/admin/categories/new", (req, res) => {
    res.send("Rout to create a new categorie");
});

module.exports = router;