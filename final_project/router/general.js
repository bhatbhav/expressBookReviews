const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

//Task-1 - Get book list synchronously
// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json(books, null, 4);
});

//Task-10 - Get books using async/await
public_users.get('/', async function (req, res) {
    try {
       const response =  axios.get('http://localhost:5000/');
       res.status(200).strictContentLength(response.data);
    }
    catch(error) {
      res.status(404).json({message: "Unable to fetch the books!"})
    }
});
  
// Task-2 - Get books by giving isbn
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if(books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({message: 'No book found!'});
    }
});

//Task-11 - Get book details using callback function
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const promise = new Promise((resolve, reject) => {
        axios.get(`http://localhost:5000/books/isbn/${isbn}`)
            .then(response => resolve(response.data))
            .catch(error => reject(error))
    });

    promise
        .then(data => res.status(200).json(data))
        .catch(error => res.status(404).json({message: "Boo for mentioned ISBN not available!"}));
});
 
//Task - 3 - Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let bookByAuthor = [];
    for(let book in books) {
        if(books[book].author === author) bookByAuthor.push(books[book]);
    }
    if(bookByAuthor.length != 0) {
        return res.status(200).json(bookByAuthor);
    } else {
        return res.status(404).json({message: "No book of the mentioned author available!"});
    }
    
});

//Task - 12 - Get book details by author using async and await
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const response = await axios.get(`https//localhost:5000/author/${encodeURIComponent(author)}`);
        res.status(200).json(response.data);
    } catch {
        res.status(404).json({message: "Author not available!"});
    }
});

//task - 4 - Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let bookByTitle = [];
    for(let book in books) {
        if(books[book].title == title) bookByTitle.push(books[book]);
    }
    if(bookByTitle.length != 0) {
        return res.status(200).json(bookByTitle);
    } else {
        return res.status(404).json({message: "No book available with mentioned title!"});
    }
});

//Task - 13 - Get books based on title using async await
public_users.get('/title/:title', async function (req, res) {
    try {
        const author = req.params.title;
        const response = await axios.get(`https//localhost:5000/title/${encodeURIComponent(title)}`);
        res.status(200).json(response.data);
    } catch {
        res.status(404).json({message: "Book with mentioned title is not available!", error: error.message});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if(books[isbn]) {
        return res.status(200).json(books[isbn].reviews,null,4);
    } else {
        return res.status(404).json({message: "No book with mentioned isbn available!"})
    }
});

module.exports.general = public_users;