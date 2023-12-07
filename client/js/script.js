import { Book } from "./Book.js";

const socket = io('http://localhost:3000');

async function getBooksData() {
  try {
    const response = await axios.get('http://127.0.0.1:3000/books');
    return response.data.books;
  } catch (err) {
    console.log(err);
  }
}

const booksData = await getBooksData();

let books = booksData.map(
  (book, i) => new Book(
    book.name, book.price, book.amount, `book${i+1}`, `buy-book${i+1}`
  )
);

socket.on('updateBook', (data) => {
  //console.log('FROM SOCKET. Book updated: ', data);

  const i = books.findIndex(el => el.name === data.book.name);
  books[i].updateBookDataOnObject(data.book.amount);
});

