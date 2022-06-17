const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

//mysql

const connection = mysql.createConnection({
host:'localhost',
user:'root',
password:'1234',
database:'company'
});

connection.connect(error =>{
if (error) throw error;
console.log('database server running!');
})

app.get('/', (req, res) => {
res.send('Hello World!')
})

// all users

app.get('/users',(req,res)=>{

const sql = 'SELECT * FROM users';

connection.query(sql,(error, results)=>{
    if (error) throw error;
    if (results.length > 0){
    res.json(results);
    }else{
    res.send('Not results');
    }
});
});

app.get('/users/:id',(req,res)=>{

const {id}= req.params;
const sql = `SELECT * FROM users WHERE id = ${id}`;

connection.query(sql,(error, results)=>{
    if (error) throw error;
    if (results.length > 0){
    res.json(results);
    }else{
    res.send('Not results');
    }
});
});

app.post('/add',(req,res)=>{

const sql = 'INSERT INTO users SET ?';

const userObj = {
    user: req.body.user,
    password: req.body.password
};

connection.query(sql,userObj, error=>{
    if (error) throw error;
    res.send('User created!');
});
});

app.put('/update/:id',(req,res)=>{

const {id}= req.params;
const {user,password} = req.body;
const sql = `UPDATE users SET user = '${user}', password = '${password}' WHERE id = ${id}`

connection.query(sql, error => {
    if (error) throw error;
    res.send('User updated!');
});

});

app.delete('/delete/:id',(req,res)=>{

const {id}= req.params;
const sql = `DELETE FROM users WHERE id = ${id}`;

connection.query(sql, error => {
    if (error) throw error;
    res.send('User deleted!');
});

});

app.listen(port, () => {
console.log(`Server running on port ${port}`)
}) 