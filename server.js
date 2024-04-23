const express = require('express');
const app = express();
const mysql = require('mysql');

app.listen(3000, () => console.log('Listening at port 3000'));

app.use(express.static('public'));
app.use(express.json());
app.use('/img', express.static('img'));

//code object db to connect to MySQL
const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"HufflePuff530!",
    database:"plantpal_db"
});

//code to confirm connection to MySQL
db.connect(error => {
    if (error) {
        return console.error('Error connecting: ' + error.stack);
    }
    console.log('Connected to MySQL database')
});

//code to read data from MySQL database
app.get('/plants', (request, response) => {
    const query = "SELECT * FROM plants"
    db.query(query, (error, data) => {
        if(error) {
            console.error('Error querying database', error);
            return;
        } else {
            response.json(data);
        }
        
    })
});

//code to create a route to send data from frontend to server
app.post('/api', (request, response) => {
    console.log(request.body);
    const data = request.body;

    response.json({
        status: 'Success',
        name: data.name,
        type: data.type,
        date: data.dateAdded
    });

    //code to add data to MySQL
    const query = 'INSERT INTO plants (name, type, recentDate) VALUES (?,?,?)';
    db.query(query, [data.name, data.type, data.dateAdded], (error, result) => {
        if (error) {
            console.error('Error inserting data!') + console.log(error);
            return;
        } else {
            console.log('Data inserted successfully!');
        }
    });
    
});

//code to update date per user
app.post('/update', (request, response) => {
    console.log(request.body);
    const { plantName, newDate } = request.body;

    const updateQuery = 'UPDATE plants SET recentDate = ? WHERE name = ?';
    db.query(updateQuery, [newDate, plantName], (error, result) => {
        if(error) {
            console.error('Error updating date: ', error);
            return;
        }
        console.log('Date updated successfully!');
    })

});

function updateMinimum() {
    const parameterValue = 'Minimum';
    const daysToAdd = 14;

    const query = 'SELECT name, recentDate FROM plants WHERE type = ?';

    db.query(query, [parameterValue], (error, results, fields) => {

        if (error) {
            console.error('Error executing query: ' + error);
            return;
        }
    
        results.forEach((row) => {
    
            const originalDate = new Date(row.recentDate);
            const newDate = new Date(originalDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    
            const updateQuery = 'UPDATE plants SET nextDate = ? WHERE name = ?';
    
            db.query(updateQuery, [newDate, row.name], (error, results, fields) => {
                if (error) {
                    console.error('Error executing UPDATE query: ' + error);
                    return;
                }
                console.log(`Updated ${row.name} row successfully.`);
            })
    
        })
    })
}//end update for 'Minimum' plant type

function updateAverage() {
    const parameterValue = 'Average';
    const daysToAdd = 7;

    const query = 'SELECT name, recentDate FROM plants WHERE type = ?';

    db.query(query, [parameterValue], (error, results, fields) => {

        if (error) {
            console.error('Error executing query: ' + error);
            return;
        }
    
        results.forEach((row) => {
    
            const originalDate = new Date(row.recentDate);
            const newDate = new Date(originalDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    
            const updateQuery = 'UPDATE plants SET nextDate = ? WHERE name = ?';
    
            db.query(updateQuery, [newDate, row.name], (error, results, fields) => {
                if (error) {
                    console.error('Error executing UPDATE query: ' + error);
                    return;
                }
                console.log(`Updated ${row.name} row successfully.`);
            })
    
        })
    })
}//end update for 'Average' plant type

function updateFrequent() {
    const parameterValue = 'Frequent';
    const daysToAdd = 3;

    const query = 'SELECT name, recentDate FROM plants WHERE type = ?';

    db.query(query, [parameterValue], (error, results, fields) => {

        if (error) {
            console.error('Error executing query: ' + error);
            return;
        }
    
        results.forEach((row) => {
    
            const originalDate = new Date(row.recentDate);
            const newDate = new Date(originalDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    
            const updateQuery = 'UPDATE plants SET nextDate = ? WHERE name = ?';
    
            db.query(updateQuery, [newDate, row.name], (error, results, fields) => {
                if (error) {
                    console.error('Error executing UPDATE query: ' + error);
                    return;
                }
                console.log(`Updated ${row.name} row successfully.`);
            })
    
        })
    })
}//end update for 'Frequent' plant type

updateMinimum();
updateAverage();
updateFrequent();