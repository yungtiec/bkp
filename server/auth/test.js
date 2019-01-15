const express = require('express');
const uport = require('uport');
const bodyParser = require('body-parser')

  const signer = uport.SimpleSigner("6a463bdfb9ef18f6182e0febc38944c0aaac0aecf16f29871b91cea420570307");
const endpoint = "http://3a76ec1a.ngrok.io";  // replace this with a public IP or HTTP tunnel

const credentials = new uport.Credentials({
  appName: 'Garde',
  address: "2omExjjDCWiNJjXUtozkp77xK92nBzgPh3z",
  signer: signer
})

const app = express();

app.use(bodyParser.json({ type: '*/*' }))

app.get('/', function (req, res) {
  credentials.createRequest({
    callbackUrl: `${endpoint}/callback`,
    exp: Math.floor(new Date().getTime()/1000) + 300
  }).then( function(requestToken) {
    let uri = 'me.uport:me?requestToken=' + requestToken + '%26callback_type=post'
    let qrurl = 'http://chart.apis.google.com/chart?cht=qr&chs=400x400&chl=' + uri
    let mobileUrl = 'https://id.uport.me/me?requestToken=' + requestToken + '&callback_type=post'
    console.log(uri)
    res.send('<div><img src=' + qrurl + '></img></div><div><a href=' + mobileUrl + '>Click here if on mobile</a></div>');
  })

})

app.post('/callback', function (req, res) {
  let jwt = req.body.access_token
  console.log("\n\nJWT (access token): \n");
  console.log(jwt);

  credentials.receive(jwt).then( function(creds) {
    console.log("\n\nDecoded JWT: \n");
    console.log(creds);
  })
})

let server = app.listen(8081, function () {
  console.log("\n\nCredential Requestor service up and running!");
  console.log(`Open your browser to ${endpoint} to test the service. \n`);
  console.log("Watch this console for results from the service. \n")
  console.log("Service Output: \n")
})
