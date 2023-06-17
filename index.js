const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const app = express();
dotenv.config();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

const questionRouter = require('./routers/questionRouter');
const testRouter = require('./routers/testRouter');
const testResultRouter = require('./routers/testResultRouter');
const userRouter = require('./routers/usersRouter');

// mongoose
//   .connect('mongodb://localhost:27017/', {
//     dbName: 'teoriquiz-backend',
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log('connected to database');
//   })
//   .catch((err) => {
//     console.log(err);
//   });

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.u2hl5.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('connected to database');
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/api', questionRouter);
app.use('/api', testRouter);
app.use('/api', testResultRouter);
app.use('/api', userRouter);

app.listen(process.env.PORT || 8100, () => {
  console.log(`connected to port 8000`);
});
