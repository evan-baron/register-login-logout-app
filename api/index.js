const express = require("express");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes');
const PORT = process.env.PORT || 5000;
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors({ 
	origin: 'http://localhost:5173',
	credentials: true
 }));
app.use('/', authRoutes);


app.listen(PORT, () => {
	console.log(`Connected to server. Listening on PORT ${PORT}.`)
})