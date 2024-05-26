const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');

const app = express();
const port = 4000;

app.use((req, res, next) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://master--assaver.netlify.app',
      'https://a309-185-199-104-14.ngrok-free.app'
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
  

const vapidKeys = {
  publicKey: '-gWoFFX8N8CYgKa5r-Ok',
  privateKey: ''
};

webpush.setVapidDetails(
  'mailto:@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.use(bodyParser.json());

let subscriptions = [];
let trackedAddresses = [];

app.post('/subscribe', (req, res) => {
    console.log(req.body)
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

app.post('/submit', (req, res) => {
    console.log(req.body)
  const { address, severityLevels } = req.body;
  if (!trackedAddresses.includes(address)) {
    trackedAddresses.push(address);
  }
  res.status(201).json({});
});

const sendNotification = (subscription, data) => {
  webpush.sendNotification(subscription, JSON.stringify(data))
    .catch(err => console.error('Error sending notification', err));
};
const checkTransactions = async () => {
    for (const address of trackedAddresses) {
      try {
        const response = await axios.get(`https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken`);
        const transactions = response.data.result;
        if (transactions && transactions.length > 0) {
          const latestTransaction = transactions[transactions.length - 1];
          const notificationPayload = {
            title: 'New Transaction Detected',
            body: `New transaction on address ${address}. Hash: ${latestTransaction.hash}`
          };
          subscriptions.forEach(sub => sendNotification(sub, notificationPayload));
        }
      } catch (error) {
        console.error('Error fetching transactions', error);
      }
    }
  };
  
  const checkTest = async () => {
    const notificationPayload = {
        title: 'New Transaction Detected',
        body: `New transaction on address test`
      };
      subscriptions.forEach(sub => sendNotification(sub, notificationPayload));
  }
  // Check for new transactions every minute
  setInterval(checkTest, 6000);
  
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
// app.post('/submit', (req, res) => {
//   console.log('body', req.body)
//   const subscription = req.body;
//   subscriptions.push(subscription);
//   res.status(201).json({});
// });

// app.post('/api/sendNotification', (req, res) => {
//   const notificationPayload = {
//     title: req.body.title,
//     body: req.body.body,
//   };

//   const promises = subscriptions.map(sub => 
//     webpush.sendNotification(sub, JSON.stringify(notificationPayload))
//   );

//   Promise.all(promises)
//     .then(() => res.sendStatus(200))
//     .catch(err => {
//       console.error("Error sending notification, reason: ", err);
//       res.sendStatus(500);
//     });
// });

// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
