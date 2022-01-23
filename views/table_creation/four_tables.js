var express=require('express');
var mysql=require('mysql');
var app= express();

var db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'firstcare'
})

db.connect(function(err){
    if(err)
    console.log(err);
    else
    console.log("MySQL is connected...");
})

app.get('/',function(req,res){
    let sql1='CREATE TABLE customers(id int AUTO_INCREMENT, username varchar(255), customer_name varchar(255),email varchar(255), password varchar(255), PRIMARY KEY(id))';
    db.query(sql1,function(err,result){
        if(err)
        console.log(err);
        else
        console.log("CUSTOMERS table has been added");
    });
    let sql2='CREATE TABLE medicines(id int AUTO_INCREMENT, med_name varchar(255), company_name varchar(255),price decimal(10,2), quantity int, PRIMARY KEY(id))';
    db.query(sql2,function(err,result){
        if(err)
        console.log(err);
        else
        console.log("medicines table has been added");
    });
    let sql3='CREATE TABLE companies(id int AUTO_INCREMENT, username varchar(255), company varchar(255),email varchar(255), password varchar(255), PRIMARY KEY(id))';
    db.query(sql3,function(err,result){
        if(err)
        console.log(err);
        else
        console.log("COMPANIES table has been added");
    });
    let sql4='CREATE TABLE bought_medicines(id int AUTO_INCREMENT, username varchar(255), company varchar(255),med_name varchar(255), quantity int, price decimal(10,2),bill decimal(10,2), PRIMARY KEY(id))';
    db.query(sql4,function(err,result){
        if(err)
        console.log(err);
        else
        console.log("boutght_medicines table has been added");
    });
    res.send('All four tables were created.\n\nCheck phpmyadmin');
})

app.listen(27017,process.env.IP,function(){
    console.log("Server has started");
})