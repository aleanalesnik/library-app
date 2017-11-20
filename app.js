// ---------- CONFIG MODULES ----------
const Sequelize = require('sequelize')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const app = express();

// ---------- BCRYPT ----------
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 'myPassword';
const someOtherPlaintextPassword = 'somePassword';



// SEQUELIZE
const sequelize = new Sequelize('library_app', process.env.POSTGRES_USER, null, {
    host: 'localhost',
    dialect: 'postgres',
    storage: './session.postgres',
    define: {
        timestamps: false
    }
});

// VIEWS
app.use(express.static('public'))
app.set('views', 'src/views')
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({ extended: true }));

// SESSIONS & SEQUELIZE STORE
app.use(session({
    store: new SequelizeStore({
        db: sequelize,
        checkExpirationInterval: 15 * 60 * 1000,
        expiration: 24 * 60 * 60 * 1000
    }),
    secret: "safe",
    saveUnitialized: true,
    resave: false
}));


// MODEL DEFINITION 
const Author = sequelize.define('authors', {
    name: { type: Sequelize.STRING }
});

const Book = sequelize.define('books', {
    bookTitle: { type: Sequelize.STRING }
});

const User = sequelize.define('users', {
    username: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING }
});


// TABLE ASSOCIATIONS

Author.hasMany(Book);
Book.belongsTo(Author);

sequelize.sync()







// ---------- ROUTING ----------




// ---------- HOME (GET) ----------
app.get('/', function(req, res) {
    var author = req.session.author
    var message = req.query.message // is only populated if you just created a user 
    res.render("home", { author: author, message: message })

});



// ---------- ADD BOOK (GET) ----------
app.get('/addbook', function(req, res) {
    res.render("addbook");
});



// ---------- ADD BOOK (POST) ----------
app.post('/addbook', function(req, res) {

    var title = req.body.bookTitle;
    var author = req.body.authorName;

    Author.create({
            name: author
        })
        .then(function(author) {
            return author.createBook({
                bookTitle: title,
            })
        })
        .then((book) => {
            res.redirect(`/books/${book.id}`);
        })
});



// ---------- DISPLAY BOOK & AUTHOR (GET) ----------
app.get('/books/:bookId', function(req, res) {

    const bookId = req.params.bookId;

    Book.findOne({
            where: {
                id: bookId
            },
            include: [{
                model: Author
            }]
        })
        .then(function(book) {
            console.log(book)
            console.log(book.author);
            console.log('Authordata: ' + book.author.name);
            res.render("book", { bookTitle: book.bookTitle, bookId: bookId, name: book.author.name });
        })
});



// ---------- DISPLAY ALL BOOKS (GET) ----------
app.get('/books', function(req, res) {
    Book.findAll({
            include: [{
                model: Author
            }]
        })
        .then((books) => {
            console.log(books)
            res.render('books', { booksList: books })
        })
})



// ---------- ABOUT PAGE (GET) ----------
app.get("/about", (req, res) => {
    res.render("about")
})





// --------------------SIGNUP & LOGIN--------------------


// ---------- SIGN UP (GET) ----------
app.get("/signup", (req, res) => {
    res.render("signup");
})

// ---------- SIGN UP (POST) ----------
app.post('/signup', (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(function(hash) {
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: hash
        }).then((user) => {
        req.session.user = user; // where user's details (cookie) exists
        console.log(req.session)
        res.redirect('/profile');
        })
    })
    
})


// ---------- PROFILE PAGE (GET) ----------
app.get("/profile", (req, res) => {
    const loggedIn = req.session.user;
    console.log(loggedIn)
    res.render("profile", { user: loggedIn });
})



// ---------- LOGIN PAGE (GET) ----------
app.get("/login", (req, res) => {
    res.render("login");
})

// ---------- LOGIN PAGE (POST) ----------
app.post('/login', function(request, response) {

    var email = request.body.email
    var password = request.body.password

    User.findOne({
        where: {
            email: email
        }
    })
    .then(function(user) {
        if (user !== null) {
            bcrypt.compare(password, user.password, function(err, res) { // compare PW with hash in DB
                if(res) {
                    request.session.user = user;
                    response.render('profile', { user: user });
                } else {
                    response.redirect('/message');
                }  
            })    
        } 
    })
    .catch(function(error) {
        console.error(error)
    })
});


// ---------- MESSAGE PAGE (GET) ----------
app.get("/message", (req, res) => {
    res.render("message");
})




// ---------- LOG OUT PAGE (GET) ----------
app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            throw error;
        }
        res.redirect('/?message=' + encodeURIComponent("Successfully logged out."));
    })
})






// ---------- PORT ----------
app.listen(3000, function() {
    console.log("App listening on port 3000")
})