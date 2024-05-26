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
// Etherscan Sepolia API key
const ETHERSCAN_API_KEY = '';

// Infura or Alchemy Sepolia RPC URL
const SEPOLIA_RPC_URL = 'https://sepolia.gateway.tenderly.co';

const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);

const checkTransactions = async () => {
  try {
    const latestBlock = await provider.getBlockNumber();
    console.log('Latest Block:', latestBlock);

    for (const address of trackedAddresses) {
      try {
        const response = await axios.get(`https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${latestBlock - 5}&endblock=${latestBlock}&sort=asc&apikey=${ETHERSCAN_API_KEY}`);
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
        console.error('Error fetching transactions for address:', address, error);
      }
    }
  } catch (error) {
    console.error('Error fetching latest block:', error);
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
