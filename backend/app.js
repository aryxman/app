
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');

const audienceRoutes = require('./routes/audienceRoutes');
const messageRoutes = require('./routes/messageRoutes')


const app = express();
const PORT = process.env.PORT || 5000;




app.use(cors());


app.use(bodyParser.json());


app.use('/api', customerRoutes);
app.use('/api', orderRoutes);
app.use('/api', audienceRoutes);
app.use('/api', messageRoutes);
// app.use('/auth', authRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
