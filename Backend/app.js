const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
// const twilio = require("twilio");
// const bodyParser = require("body-parser");
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapRoutes = require('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// const client = twilio(accountSid, authToken);

const cookieParser = require('cookie-parser');

app.use(express.json());
// app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapRoutes);
app.use('/rides', rideRoutes);
app.use(express.urlencoded({ extended: true }));

const connect = require('./database/db');
connect();

// app.post("/send-sms", async (req, res) => {
//   console.log(req.body);
//   const { to, message } = req.body;
//   try {
//     // const sms = await client.messages.create({
//     //   body: message,
//     //   from: twilioPhoneNumber,
//     //   to: to,
//     // });

//     console.log("SMS sent:", "sms.sid");
//     res.status(200).json({ success: true, message: "SMS sent successfully!" });
//   } catch (error) {
//     console.error("Error sending SMS:", error);
//     res.status(500).json({ success: false, message: "Failed to send SMS." });
//   }
// });
app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports  = app;