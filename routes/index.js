const express = require('express');
const router = express.Router({ strict: true });
var Books = require('../models').Books;

router.get('/', (req, res) => {
    res.redirect('/books');
});

router.get('/books', (req, res, next) => {
    Books.findAll({ order: [["title", "asc"]] }).then(function (books) {
        res.render('index', { books: books, title: "Books" });
    }).catch(function (error) {
        const err = new Error('500 - Internal Server Error');
        err.status = 500;
        next(err);
    });
});

router.get('/books/new', (req, res) => {
    res.render('new-book', { errors: null, title: "New Book" });
});

router.post('/books/new', (req, res, next) => {
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
    }).catch(function (error) {
        const err = new Error('500 - Internal Server Error');
        err.status = 500;
        next(err);
    });
});

router.get('/books/:id', (req, res, next) => {
    Books.findByPk(req.params.id).then((book) => {
        if (book) {
            res.render('update-book', { errors: null, book: book, title: "Update Book" });
        } else {
            const err = new Error('500 - Internal Server Error');
            err.status = 500;
            next(err);
        }
    }).catch(function (error) {
        const err = new Error('500 - Internal Server Error');
        err.status = 500;
        next(err);
    });
});

router.post('/books/:id', (req, res, next) => {
    Books.findByPk(req.params.id).then((book) => {
        if (book) {
            return book.update(req.body);
        } else {
            const err = new Error('500 - Internal Server Error');
            err.status = 500;
            next(err);
        }
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
    }).catch(function (error) {
        const err = new Error('500 - Internal Server Error');
        err.status = 500;
        next(err);
    });
});

router.post('/books/:id/delete', (req, res, next) => {
    Books.findByPk(req.params.id).then((book) => {
        if (book) {
            return book.destroy();
        } else {
            const err = new Error('500 - Internal Server Error');
            err.status = 500;
            next(err);
        }
    }).then(() => {
        res.redirect('/books');
    }).catch(function (error) {
        const err = new Error('500 - Internal Server Error');
        err.status = 500;
        next(err);
    });
});

module.exports = router;