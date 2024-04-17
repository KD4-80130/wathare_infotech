const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); 

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  initializeData(); // Call to function that checks and initializes data
}).catch(err => console.log('Failed to connect to MongoDB:', err));


const DataSchema = new mongoose.Schema({
    ts: Date,               // timestamp
    machine_status: Number,
    vibration: Number
});
const Data = mongoose.model('Data', DataSchema);


const sampleData = require('/home/sunbeam/Wathare infotech/sample-data.json'); // Adjust path as necessary


async function initializeData() {
  const count = await Data.countDocuments();
  if (count === 0) {
    await Data.insertMany(sampleData);
    console.log('Data initialized in MongoDB');
  }
}

app.get('/data', async (req, res) => {
    const data = await Data.find({});
    res.json(data);
  });


  //API 
  app.get('/filterApi', async (req, res) => {
    try {
      const { start, end, frequency } = req.query;
  

      const startDate = new Date(start);
      const endDate = new Date(end);
  
     
      const query = {
        ts: {
          $gte: startDate,
          $lt: endDate
        }
      };
  
      switch (frequency) {
        case 'hourly':
          endDate.setHours(endDate.getHours() + 1);
          break;
        case 'daily':
          endDate.setDate(endDate.getDate() + 1);
          break;
        case 'weekly':
          endDate.setDate(endDate.getDate() + 7);
          break;
        case 'monthly':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
        default:
          break;
      }

      query.ts.$lt = endDate;
  
      const data = await Data.find(query);
      res.json(data);
    } catch (error) {
      console.error('Error fetching filtered data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
