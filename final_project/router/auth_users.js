const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: "mockuser", password: "mockpassword"}];

const isValid = (username)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if(username && password){
    if(authenticatedUser(username,password)){
      let token = jwt.sign({username:username}, 'my-secret-key', { expiresIn: '1h' });
      req.session.authorization = {
        token, username
      }
      return res.status(200).json({message: "User logged in successfully", token: token});
    }
    else{
      return res.status(400).json({message: "Username or password is incorrect"});
    }
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
    if(books[isbn]){
        if(books[isbn].reviews[username]){
            books[isbn].reviews[username] = [review];
            return res.status(200).json({ message: "Review modified successfully" });
        } else{
        books[isbn].reviews[username] = [review];
        return res.status(200).json({ message: "Review added successfully" });
    }
  }
  else{
    return res.status(404).json({message: "No book found with ISBN "+isbn});
  }
});

// delete book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let username = req.session.authorization.username;
  if(books[isbn]){
    if(books[isbn].reviews[username]){
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    }
    else{
      return res.status(404).json({message: "No review found for ISBN "+isbn});
    }
  }
  else{
    return res.status(404).json({message: "No book found with ISBN "+isbn});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;