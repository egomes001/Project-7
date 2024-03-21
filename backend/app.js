const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://dbUser:FBQa6SLTYNbQmEzl@cluster0.ijofa9c.mongodb.net/',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// new way, old way was "body-parser"
// allow the use of request.body
app.use(express.json());

// No route specified because we want the middleware to be appplied to every routes of the server
app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.post('/api/books', (request, response, next) => {
    console.log(request.body);
    response.status(201).json({
        message: 'Book saved'
    });
});

app.get('/api/books', (request, response, next) => {
    const books = [
        {
            userId : 'shifldhjfjHJKHH',
            title : 'Titre du Livre',
            author : 'Super Auteur',
            imageUrl : '#',
            year: '2024',
            genre: 'genre',
            ratings : [
            {
            userId : 'shifldhjfj367BG',
            grade : 4
            }
            ], 
            averageRating : null
        },
        {
            userId : 'shifldhjfj367BG',
            title : 'Super Titre',
            author : 'Super Auteur',
            imageUrl : '#',
            year: '2022',
            genre: 'genre',
            ratings : [
            {
            userId : 'shifldhjfjHJKHH',
            grade : 3
            }
            ], 
            averageRating : null
        }
    ];
    response.status(200).json(books);
    console.log('Response successfully sent !');
});

module.exports = app;