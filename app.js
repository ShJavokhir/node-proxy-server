const { default: axios } = require("axios");

var qr = require("qr-image");

var express = require("express"),
  request = require("request"),
  bodyParser = require("body-parser"),
  app = express();

// var myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
// console.log('Using limit: ', myLimit);

app.use(bodyParser.json());

app.all("*", async function (req, res, next) {
  // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    req.header("access-control-request-headers")
  );

  if (req.method === "OPTIONS") {
    // CORS Preflight
    res.send();
  } else {
    // console.log(req.body);

    let data = JSON.stringify({
      vcId: req.body.vcId,
      fields: {
        graduationYear: parseInt(req.body.fields.graduationYear),
        isGraduated: (req.body.fields.isGraduated),
      },
      targetDid: req.body.targetDid,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api.gatekeeper.software/v1/vc/issue",
      headers: {
        appId: req.header("appId"),
        "Content-Type": "application/json",
        Authorization: req.header("authorization"),
      },
      data: data,
    };

    var targetURL = "http://api.gatekeeper.software"; //req.header('https://api.gatekeeper.software'); // Target-URL ie. https://example.com or http://example.com
    // if (!targetURL) {
    //     res.send(500, { error: 'There is no Target-Endpoint header in the request' });
    //     return;
    // }
    // console.log(targetURL + req.url);
    // console.log(req.method);
    // console.log(req.header("authorization"));
    console.log(config);

    await axios.request(config).then(async (response) => {
      console.log("Response succesfully");
    //   console.log(response.data);
    //   const result =  await axios.get(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${JSON.stringify(response.data)}`);
    //   console.log(result);
    res.setHeader('content-type', "image/png");
    res.setHeader('transfer-encoding', "chunked");
    request(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${JSON.stringify(response.data)}`, {method: "GET"}).pipe(res)

    //   res.send(result.data);
    }).catch(err => {
        res.send("Server error: " + err);
        console.error(err);
    });
  }
});

app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), function () {
  console.log("Proxy server listening on port " + app.get("port"));
});
