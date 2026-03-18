const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const todoRoutes = require('./routes/todoRoutes');

// --- UPDATED MIDDLEWARE ---
// Render par jab aap deploy karoge, toh cors allow karna zaroori hai
app.use(cors({
    origin: "*", // Shuruat mein sab allow kar do taaki connection error na aaye
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

// Base Route (Testing ke liye ki backend live hai ya nahi)
app.get('/', (req, res) => {
    res.send('TaskFlow Backend is Running Live! 🚀');
});

// --- MONGODB CONNECTION ---
// Make sure process.env.MONGO_URI is set in Render Dashboard
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// --- PORT CONFIGURATION ---
// Render automatically provides a PORT, so process.env.PORT is MUST
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
});