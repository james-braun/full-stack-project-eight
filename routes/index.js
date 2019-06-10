const express = require('express');
const router = express.Router({ strict: true });
var Books = require('../models').Books;

router.get('/', (req, res) => {
    res.redirect('/books');
});

router.get('/books', (req, res) => {
    Books.findAll({ order: [["title", "asc"]] }).then(function (books) {
        res.render('index', { books: books, title: "Books" });
    });

});

router.get('/books/new', (req, res) => {
    res.render('new-book', { errors: null, title: "New Book" });
});

router.post('/books/new', (req, res) => {
    Books.create(req.body).then(function () {
        res.redirect('/books');
    }).catch(function (error) {
        if (error.name === "SequelizeValidationError") {
            for (err in error.errors) {
                console.log(error.errors[err].message);
            };
            res.render('new-book', { errors: error.errors, title: "New Book" });
        } else {
            throw error;
        }
    });
});

router.get('/books/:id', (req, res) => {
    Books.findByPk(req.params.id).then((book) => {
        res.render('update-book', { errors: null, book: book, title: "Update Book" });
    });
});

router.post('/books/:id', (req, res) => {
    Books.findByPk(req.params.id).then((book) => {
        return book.update(req.body);
    }).then(() => {
        res.redirect('/books');
    }).catch(function (error) {
        if (error.name === "SequelizeValidationError") {
            for (err in error.errors) {
                console.log(error.errors[err].message);
            };
            Books.findByPk(req.params.id).then((book) => {
                res.render('update-book', { errors: error.errors, book: book, title: "Update Book" });
            });
        } else {
            throw error;
        }
    });
});

router.post('/books/:id/delete', (req, res) => {
    Books.findByPk(req.params.id).then((book) => {
        return book.destroy();
    }).then(() => {
        res.redirect('/books');
    });
});

module.exports = router;