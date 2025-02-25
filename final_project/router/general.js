const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password){
      if (isValid(username)){
          users.push({"username": username, "password": password});
          return res.status(200).json({"message": "User created successfully"});
      }
      else
          return res.status(404).json({"message": "User already exists"});
  }
  else
      return res.status(404).json({"message": "Invalid Username or Password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let getPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve(JSON.stringify({"books": books}, null, 4))
      },2000);
  });

  getPromise.then((successMessage) => {
      res.send(successMessage);
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let getPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        for (const [isbn_id, book] of Object.entries(books)){
            if (isbn_id == isbn){
                resolve(JSON.stringify(book, null, 4));
            }
        }
    },2000);
  });
  
  getPromise.then((successMessage) => {
    res.send(successMessage);
  });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let getPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        let booksByAuthor = [];
        for (const [isbn_id, book] of Object.entries(books)){
            if (book["author"] === author){
                booksByAuthor.push({"isbn": isbn_id, "title": book["title"], "reviews": book["reviews"]});
            }
        }
        resolve(JSON.stringify({"booksbyauthor": booksByAuthor}, null, 4))
    },2000);
  });

  getPromise.then((successMessage) => {
      res.send(successMessage);
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let getPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        let booksByTitle = [];
        for (const [isbn_id, book] of Object.entries(books)){
            if (book["title"] === title){
                booksByTitle.push({"isbn": isbn_id, "author": book["author"], "reviews": book["reviews"]});
            }
        }
        resolve(JSON.stringify({"booksbytitle": booksByTitle}, null, 4))
    },2000);
  });

  getPromise.then((successMessage) => {
      res.send(successMessage);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  for (const [isbn_id, book] of Object.entries(books)){
    if (isbn_id == isbn){
        return res.send(JSON.stringify(book["reviews"], null, 4));
    }
  }
  return res.send({});
});

module.exports.general = public_users;
