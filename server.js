const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port =  process.env.PORT || 3000;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.set('view engine', 'hbs');

//Middleware

app.use((req, res, next)=>{
    var now = new Date().toString();
    var logLine = `${now}: ${req.method} ${req.url}`;
    console.log(logLine);
    fs.appendFile('server.log', logLine + '\n', (err) => {
        if(err){
            console.log('Unable to append to server.log');
        }
    });
    next();
});


/*app.use((req, res, next)=>{
    res.render('maintenance.hbs');
});*/

app.use(express.static(__dirname + '/public'));


//Routes
app.get('/', (req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to the home page!'
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});


app.get('/bad', (req, res) =>{
   res.send({
       errorMessage: 'unable to handle request'
   });
});

//Start webserver
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});
