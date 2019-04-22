const express = require('express');  // call express
const sgMail = require('@sendgrid/mail');
const app = express(); // create a server
const cors = require('cors')
const bodyParser = require('body-parser');
const {google} = require('googleapis');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./green-groupie-5a68894e625a.json');
const request = require('request-promise-native');

sgMail.setApiKey('');

const port = process.env.PORT || 8000;  // set our port

const G_CLIENT_ID = process.env.G_CLIENT_ID;
const G_CLIENT_SECRET = process.env.G_CLIENT_SECRET;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors())

app.get('/', (req, res) => {
  res.send('index');
});


app.post('/email', function (req, res) {
  console.log('lolol ', req.body)
  const msg = {
  to: req.body.emails,
  from: 'jnguyen@u.northwestern.edu',
  subject: req.body.subject,
  text: "You're invited to share your meeting times with Groupie!!",
  html: req.body.message + '<a href="https://green-groupie.firebaseapp.com/profile/">'+
        ' Click Here </a>'+ ' to begin importing your calendar',
};

  sgMail.send(msg).then(res => console.log('succccc',res)).catch(err => console.log('errrrrr',err))
  res.send('test')
});

app.get('/add', (req, res) => {
  const {uid} = req.query;
  const oauth2Client = new google.auth.OAuth2(
    G_CLIENT_ID,
    G_CLIENT_SECRET,
    'http://localhost:8000/oauthcallback'
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.readonly', 'openid', 'profile', 'email'],
    state: uid
  });

  res.send(url);
});

app.get('/oauthcallback', async (req, res) => {
  const db = firebaseAdmin.firestore();

  const {code, state} = req.query;

  const oauth2Client = new google.auth.OAuth2(
    G_CLIENT_ID,
    G_CLIENT_SECRET,
    'http://localhost:8000/oauthcallback'
  );

  let tokens;
  try {
    tokens = (await oauth2Client.getToken(code)).tokens;
  } catch (e) {
    console.log(e);
  }

  const oauth_info = await request("https://www.googleapis.com/oauth2/v1/userinfo?fields=email&oauth_token=" + tokens.access_token);
  const {email: userEmail} = JSON.parse(oauth_info);

  db.collection("integrations").add({
    type: "Google",
    display: userEmail,
    uid: state
  });

  res.writeHead(302, {
    "Location": "http://localhost:3000/profile/"
  });
  res.end();
});

app.listen(port, async function () {
  console.log(`Example app listening on port ${port}!`);
  console.log(`G_CLIENT_ID: ${G_CLIENT_ID}`);
  console.log(`G_CLIENT_SECRET: ${G_CLIENT_SECRET}`);

  await firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount)
  });
});
