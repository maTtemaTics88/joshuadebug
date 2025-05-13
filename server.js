const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Set up handlebars
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Initialize user data file
const usersFilePath = path.join(__dirname, 'data', 'users.json');
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, '{}');
}

// Save/Update
app.post('/save', (req, res) => { //Handles post requests for Save/Update
    const { username, email, name, birthday, password } = req.body; //Destructure the data. Gets ID, desc, date and status
    
    const userData = JSON.parse(fs.readFileSync(usersFilePath)); //Reads the existing to do list from todolist.JSON

    userData[username] = { email, name, birthday, password }; //Save/Update through taskNumber as @key

    fs.writeFileSync(usersFilePath, JSON.stringify(userData, null, 2)); //Writes the data at the end of the JSON file (saves, but not inputs code to the file)

    res.redirect('/'); //After performing, it will redirect to homepage
});

// Transfer
app.get('/', (req, res) => {
    let userData = {}; //Makes an empty to do list object for transfer

    if (fs.existsSync(usersFilePath)) { //Reads and parse existing data, if it exists.
      userData = JSON.parse(fs.readFileSync(usersFilePath));
    }

    res.render("index", { userData }); //Renders the 'index' from html and pass the data
});

// Delete
app.get('/delete', (req, res) => { //Handles get requests for delete
    const { username } = req.query; //Gets the taskNumber value
    
    const userData = JSON.parse(fs.readFileSync(usersFilePath)); //Reads data from existing to do list file

    delete userData[username]; //Deletes the data using taskNumber @key

    fs.writeFileSync(usersFilePath, JSON.stringify(userData, null, 2)); //Writes the updated to do list

    res.redirect('/'); //Redirects to homepage
});


const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});