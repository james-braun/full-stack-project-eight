const express = require('express');
const router = express.Router({ strict: true });
var Books = require('../models').Books;

// when program boots redirect to "/books"
router.get('/', (req, res) => {
    res.redirect('/books');
});

// render the whole database to the page.
router.get('/books', (req, res, next) => {

    // render in alphabetical order according to title.
    Books.findAll({ order: [["title", "asc"]] }).then(function (books) {
        res.render('index', { books: books, title: "Books" });

    // catch any server errors.
    }).catch(function (error) {
        const err = new Error('500 - Internal Server Error');
        err.status = 500;
        next(err);
    });
});

// render the add a new book page.
router.get('/books/new', (req, res) => {
    res.render('new-book', { errors: null, title: "New Book" });
});

// update the database with new book.
router.post('/books/new', (req, res, next) => {

    // create a new book.
    Books.create(req.body).then(function () {
        res.redirect('/books');

    // catch any errors creating a new book.
    }).catch(function (error) {

        // if error is a sequelize error log the errors
        // and re-render add a new book. otherwise send
        // error futher down the chain.
        if (error.name === "SequelizeValidationError") {
            for (err in error.errors) {
                console.log(error.errors[err].message);
            };
            res.render('new-book', { errors: error.errors, title: "New Book" });
        } else {
            throw error;
        }

    // catch unhandled errors.
    }).catch(function (error) {
        const err = new Error('500 - Internal Server Error');
        err.status = 500;
        next(err);
    });
});

// render book update form.
router.get('/books/:id', (req, res, next) => {

    // find book in database.
    Books.findByPk(req.params.id).then((book) => {

        // if book is in database then render udate form.
        // else throw error.
        if (book) {
            res.render('update-book', { errors: null, book: book, title: "Update Book" });
        } else {
            const err = new Error('500 - Internal Server Error');
            err.status = 500;
            next(err);
        }

    // catch any uncaught server errors.
    }).catch(function (error) {
        const err = new Error('500 - Internal Server Error');
        err.status = 500;
        next(err);
    });
});

// update a book in the database.
router.post('/books/:id', (req, res, next) => {

    // find book in database.
    Books.findByPk(req.params.id).then((book) => {

        // if the book is in the database then update it.
        // else throw error.
        if (book) {
            return book.update(req.body);
        } else {
            const err = new Error('500 - Internal Server Error');
            err.status = 500;
            next(err);
        }

    // redirect to "/books"
    }).then(() => {
        res.redirect('/books');

    // if there is a sequelize error log the errors and
    // re-render update book page with errors. else throw error.
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

    // catch any uncought server errors.
    }).catch(function (error) {
        const err = new Error('500 - Internal Server Error');
        err.status = 500;
        next(err);
    });
});

// delete a book from the database.
router.post('/books/:id/delete', (req, res, next) => {

    // find book in database.
    Books.findByPk(req.params.id).then((book) => {

        // if book exists delete i from the database
        // else throw error.
        if (book) {
            return book.destroy();
        } else {
            const err = new Error('500 - Internal Server Error');
            err.status = 500;
            next(err);
        }

    // return to "/books"
    }).then(() => {
        res.redirect('/books');

    // catch any uncaught server errors.
    }).catch(function (error) {
        const err = new Error('500 - Internal Server Error');
        err.status = 500;
        next(err);
    });
});

module.exports = router;