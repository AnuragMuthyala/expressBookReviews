const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let filtered_users = users.filter((user) => {return user.username === username;});
    if (filtered_users.length > 0)
        return false;
    else
        return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let auth_users = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (auth_users.length > 0)
        return true;
    else
        return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password)
    return res.status(404).json({"message": "Invalid Username or Password"});
  if (authenticatedUser(username, password)){
      let token = jwt.sign({
          data: password
      }, "access", {expiresIn: 3600});

      req.session.authorization = {
          token, username
      };

      return res.status(200).json({"message": "User logged in successfully"});
  }
  return res.status(208).json({"message": "User not authenticated"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let user = req.user;
  let isbn = req.params.isbn;
  let review = req.query.review;

  for (const [isbn_id, book] of Object.entries(books)){
      if (isbn_id == isbn){
          books[isbn_id]["reviews"][user] = review;
      }
  }

  res.send(`The review for the book with ISBN ${isbn} has been added/updated.`);
});

//Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let user = req.user;
    let isbn = req.params.isbn;

    for (const [isbn_id, book] of Object.entries(books)){
        if (isbn_id == isbn){
            delete books[isbn_id]["reviews"][user];
        }
    }

    res.send(`The review for the book with ISBN ${isbn} has been deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
