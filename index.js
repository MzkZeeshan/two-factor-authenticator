const express = require("express");
const app = express();
const cors = require("cors");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const fs = require("fs").promises;

app.use(cors());

// https://png.pngtree.com/element_pic/00/16/09/2057e0eecf792fb.jpg

app.get("/getQrCode", (req, res) => {

  var secret = speakeasy.generateSecret({
    name: "Convently",
    options:{
        encoding:"base32"
    }
  });
  fs.writeFile("token.json", JSON.stringify(secret));
  qrcode.toDataURL(`${secret.otpauth_url}&issuer=google&image=https://pngimg.com/uploads/bmw_logo/bmw_logo_PNG19707.png`, (err, data) => {
    res.json(data);
  });
  console.log(secret);

});



app.get("/verify2fa/:code", async (req, res) => {

  const code = req.params.code;
  let token = await fs.readFile("token.json");
  token = JSON.parse(token);
  const verify = await speakeasy.totp.verify({
    secret: token.base32,
    encoding: "base32",
    token: code,
  });
  res.json(verify);

});

app.listen(process.env.PORT || 7001, () =>
  console.log("Server is running at 5001")
);
