class MessageModel {
    constructor(sql, nom = "", mail = "", message = "") {
        this.sql     = sql;
        this.nom     = this.setNom(nom);
        this.mail    = this.setMail(mail);
        this.message = this.setMessage(message);
    }

    setNom(nom) {
        return nom.length <= 50 ? nom : "";
    }

    setMail(mail) {
        return mail.length <= 100 ? mail : "";
    }

    setMessage(message) {
        return message.length <= 500 ? message : "";
    }

    sendDB() {
        this.sql.query("INSERT INTO messages (nom, message) VALUES (?,?)", [this.nom, this.message]);
    }

    getAll(result) {
        this.sql.query("SELECT * FROM messages", (err, res, field) => {
            if (res) {
                result(null, res);
            }
        });
    }
}

const messageModel = MessageModel;
module.exports     = messageModel;