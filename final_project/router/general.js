const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.bosy.password;

  if (username && password){
      if (isValid(username)){
          users.push({"username": username, "password": password});
          return res.status(200).json({"message": "User created successfully"});
      }
      return res.status(404).json({"message": "User already exists"});
  }
  return res.status(404).json({"message": "Invalid Username or Password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify({"books": books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let required_books = books.filter(isbn_id => {return isbn_id == isbn});
  res.send(JSON.stringify(required_books, null, 4));
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let required_books = books.filter(isbn_id => {return isbn_id["author"] == author});
  res.send(JSON.stringify({"booksByAuthor": required_books}, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let required_books = books.filter(isbn_id => {return isbn_id["title"] == title});
  res.send(JSON.stringify({"booksByTitle": required_books}, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let required_books = books.filter(isbn_id => {return isbn_id == isbn});
  res.send(JSON.stringify(required_books[isbn_id]["reviews"], null, 4));
});

module.exports.general = public_users;
