const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const Mailgun = require("mailgun.js");
const formData = require("form-data");

const app = express();

dotenv.config();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


// Mailgun
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY
});


// Home page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});


// Newsletter subscription
app.post("/subscribe", async (req, res) => {

    let email = req.body.email;

    console.log("Subscriber email:", email);

    try {

        const result = await mg.messages.create(
            process.env.MAILGUN_DOMAIN,
            {
                from: "Deakin Newsletter <postmaster@" + process.env.MAILGUN_DOMAIN + ">",
                to: [email],
                subject: "Welcome to my Deakin Newsletter",
                text: "Thank you for subscribing to my Deakin Newsletter!"
            }
        );

        console.log("Mailgun response:", result);

        res.send("Subscription successful! Check your email.");

    } catch (error) {

        console.error("Mailgun error:", error);

        res.status(500).send("Error sending email.");

    }

});


app.listen(3000, function() {

    console.log("Server running on port 3000");

});