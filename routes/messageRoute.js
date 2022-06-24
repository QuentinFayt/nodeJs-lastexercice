var express        = require('express');
var router         = express.Router();
const sql          = require("../models/db");
const messageModel = require("../models/MessageModel");
const moment       = require("moment");
const SMTPConf     = require("../config/SMTP_config");
const nodemailer   = require("nodemailer");

let transporter = nodemailer.createTransport({
    host  : "smtp-quentin-node.alwaysdata.net",
    port  : 25,
    secure: false,
    auth  : {
        user: SMTPConf.ADMIN_LOGIN,
        pass: SMTPConf.ADMIN_PASSWORD,
    },
});

async function sendMailToUser(user, transporter) {
    await transporter.sendMail({
        from   : SMTPConf.ADMIN_USER,
        to     : user.mail,
        subject: `Quentin-node - Merci ${user.name}`,
        text   : `Merci ${user.name} pour votre message! il est visible sur la page http://quentin-node.alwaysdata.net/contact !`,
    })
}

async function sendMailToAdmin(user, transporter) {
    await transporter.sendMail({
        from   : user.mail,
        to     : SMTPConf.ADMIN_USER,
        subject: `Message from http://quentin-node.alwaysdata.net/ de l'utilisateur : ${user.name}`,
        text   : `${user.message}`,
    })
}


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

router.get("/", (req, res) => {
    new messageModel(sql).getAll((err, data) => {
        moment.locale("fr")
        res.render("index", {page: "messages", datas: data, moment: moment});
    });
}).get("/post", (req, res) => {
    res.render(`index`, {page: "contact"});
}).post("/create", (req, res) => {
    let nom  = escape(req.body.nom);
    let mail = escape(req.body.email);
    let msg  = escape(req.body.msg);
    if (req.body && nom && mail && msg) {
        new messageModel(sql, nom, mail, msg).sendDB();
        sendMailToAdmin({name: nom, mail: mail, message: msg}, transporter).catch(console.error);
        sendMailToUser({name: nom, mail: mail, message: msg}, transporter).catch(console.error);
        res.render('index', {page: "formSent", nom: nom, mail: mail, msg: msg});
    }
    else {
        res.render(`index`, {page: "contact", alert: "Veuillez remplir tout les champs!"});
    }
});

module.exports = router;