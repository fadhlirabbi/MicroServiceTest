const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.com' 
    : '*'
}));

app.use(express.json());

// Improved MongoDB connection with options
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch(err => console.error("MongoDB connection failed:", err));

// Schema with validation
const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Text is required'], // Enhanced validation message
    maxlength: [500, 'Message too long (max 500 characters)']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

// Enhanced routes with error handling
app.post('/api/messages', async (req, res) => {
  try {
    const newMessage = new Message({
      text: req.body.text // Timestamp will be auto-generated
    });
    
    const savedMessage = await newMessage.save();
    res.status(201).json({
      success: true,
      data: savedMessage
    });
    
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ timestamp: -1 })
      .limit(100); // Prevent excessive data retrieval
      
    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));