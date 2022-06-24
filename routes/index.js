var express = require('express');
var router  = express.Router();
var url     = require("url");

const whiteList = ["presentation", "aventure", "realisations"];

function escape(text) {
    return text.trim().replace(/(<([^>]+)>)/gi, "").replace(/[&<>"']/g, (el) => {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[el]
        }
    );
}

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {page: "accueil"});
    next();
}).get("/p=:param", (req, resp) => {
    const param = req.params.param;
    if (whiteList.includes(param)) {
        resp.render(`index.ejs`, {page: param});
    }
    else {
        throw new Error("L'url :</br> <span>" + req.protocol + "//" + req.hostname + req.url + "</span></br> n'est pas valide");
    }
});

module.exports = router;
