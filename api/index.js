const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const PORT = process.env.PORT || 5000;
require('dotenv').config();

const app = express();

const privateKey = fs.readFileSync(
	path.resolve(__dirname, '../certs/localhost+2-key.pem'),
	'utf8'
);
const certificate = fs.readFileSync(
	path.resolve(__dirname, '../certs/localhost+2.pem'),
	'utf8'
);

app.use(express.json());
app.use(
	cors({
		origin: 'https://localhost:5173',
		credentials: true,
	})
);
app.use('/', authRoutes);

https
	.createServer({ key: privateKey, cert: certificate }, app)
	.listen(PORT, () => {
		console.log(`Connected to server. Listening on HTTPS PORT ${PORT}.`);
	});
