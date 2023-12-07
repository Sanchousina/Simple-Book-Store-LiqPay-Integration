import { liqPay, setDataJSON, generateData, generateSignature} from "./liqpay.js";

export class Book {
  constructor(name, price, amount, bookRef, btnRef) {
    this.book = document.getElementById(bookRef);
    this.btn = document.getElementById(btnRef);
    this.name = name;
    this.price = price;
    this.amount = amount;

    this.updateHTML();

    this.btn.addEventListener('click', () => this.makePurchase());
  }

  updateHTML() {
    this.book.querySelector('.name').innerHTML = this.name;
    this.book.querySelector('.price').innerHTML = `Price: ${this.price} UAH`;
    if (this.amount > 0) {
      this.book.querySelector('.status').innerHTML = `${this.amount} left`;
    } else {
      this.book.querySelector('.status').innerHTML = 'out of stock';
      this.book.style.backgroundColor = 'grey';
      this.btn.style.backgroundColor = 'black';
    }
  }

  updateBookDataOnObject(amount) {
    this.amount = amount;
    this.updateHTML();
  }

  async makePurchase() {
    if (this.amount > 0) {
      const dataJSON = setDataJSON(this.price);
      const data = generateData(dataJSON);
      const signature = await generateSignature(data);
    
      liqPay(data, signature, async () => await this.paymentSuccessfull(), () => this.paymentFailed());
    }
  }

  async paymentSuccessfull() {
    this.amount -= 1;
    this.updateHTML();

    await this.updateBookDataOnServer();
  }

  paymentFailed() {
    alert('There was an error, try again');
  }

  async updateBookDataOnServer() {
    const response = await axios.patch('http://127.0.0.1:3000/book', {
      bookName: this.name, 
      bookAmount: this.amount
    });
    console.log(response);
  }
}