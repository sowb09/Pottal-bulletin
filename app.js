require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
//const request = require("request");
const https = require("https");
//const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  const phone = req.body.phone;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          PHONE: phone,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us20.api.mailchimp.com/3.0/lists/" + process.env.LIST_ID;

  const options = {
    method: "post",
    auth: process.env.USERNAME_ANY + ":" + process.env.API_KEY,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("The server is running on port 3000.");
});

// API Key: e3d53664272bcdc431240e512d4f8205-us20
//List ID: 7da9901df9
