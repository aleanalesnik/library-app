# Databases and Encryption
This Node.js web application focuses primarily on modules associated with Relational Databases, as well as user sign up and login functionalities.

## Libraries & Technologies
- Node.js
- SQL
- Sequelize
- Express Sessions
- Session Store
- BCrypt

## Databases
The first part of the Library Application lets visitors add literature to the online book collection and survey what other books have been posted. Once a book is entered, the book's title is added to a 'book' table and its author to an 'author' table, which are both located and stored in the 'library-app' database. 

![banner](https://github.com/aleanalesnik/library-app/blob/master/public/images/screenshots/add-book.png?raw=true)
> Add book to the Library

## User Sign Up &amp; Encryption
Using the methods of Sequelize, the Library Application also offers guests to become users through a sign up form. Once you're a user, you may log in to and see your profile! By incorporating Bcrypt, I increased my database's security and made my user's passwords secure through hashing.

![banner](https://github.com/aleanalesnik/library-app/blob/master/public/images/screenshots/sign-up.png)
> Sign up to become a user!


## Usage
* Download master branch
* NPM install
* Create a blank database in Postgres with the title 'library-app'
* Add books to the collection &amp; sign up to become a user!

![banner](https://github.com/aleanalesnik/library-app/blob/master/public/images/screenshots/home.png?raw=true)
> Library Application Home Page
