const http = require('http');
const express = require('express')
const cors = require('cors');
const socketIO = require('socket.io');
const bodyParser = require('body-parser')

const app = express()
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'PATCH'],
  },
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const port = 3000

app.use(cors());

const books = [
  {
    name: 'Great Book',
    price: 10,
    amount: 2,
  },
  {
    name: 'Super Book',
    price: 12,
    amount: 1,
  },
  {
    name: 'Awesome Book',
    price: 15,
    amount: 1,
  },
  {
    name: 'Best Book Ever',
    price: 100,
    amount: 1,
  },
]

app.get('/books', (req, res) => {
  res.status(200).send({books: books})
})

app.patch('/book', (req, res) => {
  const i = books.findIndex(el => el.name === req.body.bookName);
  if (i === -1) {
    res.status(400).send('There is no such book');
  } else {
    books[i].amount = req.body.bookAmount;

    io.emit('updateBook', {book: books[i]});

    res.status(200).send('The book updated successfully');
  }
})

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})