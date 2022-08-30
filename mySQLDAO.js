//const res = require('express/lib/response');
const { promiseImpl } = require('ejs');
const { resolve, reject } = require('promise');
var mysql = require('promise-mysql')

var pool

mysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'collegeDB'
})
    .then((result) => {
        pool = result
    })
    .catch((error) => {
        console.log("error = " + error)

    });

//get modules function to get all modules
var getModules = function () {
    //returns promis
    return new Promise((resolve, reject) => {
        //send query to mysql
        pool.query('select * from module')
            .then((result) => {
                resolve(result)
                //res.send(result)
            })
            .catch((error) => {
                reject(error)
            })
    })
}


var getStudents = function (){
    return new Promise((resolve, reject)=>{

        pool.query('select * from student')
        .then((result)=>{
            resolve(result)
        })
        .catch((error)=>{
            reject(error)
        })
    })
}

var getOneModule = function (mid){

    return new Promise((resolve, reject) =>{

        var myQuery = {
            sql: 'select * from module where mid = ?',
            values:[mid]
        }

        pool.query(myQuery)
        .then((result) =>{
            resolve(result)
        })

        .catch((error) =>{
            reject(error)
        })
    })
}

var deleteStudent = function (sid) {
    return new Promise((resolve,reject)=>{
        var myQuery = {
            sql: 'delete from student where sid = ?', 
            values: [sid]
        }
        pool.query(myQuery)
        .then((result)=>{
            resolve(result)
        })
        .catch((error)=>{
            reject(error)

        })
    })
}

var editModule = function (name, credits, mid) {
    return new Promise((resolve, reject)=>{

        var myQuery = {
            sql: 'update module set name = ?, credits = ? where mid = ?',
            values: [name, credits, mid]
        }

        pool.query(myQuery)
        .then((result) =>{

            resolve (result)
        })
        .catch(()=> {
            reject(error)
        })

    })
}



var getStudent = function (mid) {

    return new Promise((resolve, reject) => {

        var myQuery = {
            sql: 'select s.* from student s inner join student_module sm on s.sid = sm.sid where sm.mid = ?',
            values: [mid]
        }

        pool.query(myQuery)
        .then((result) =>{
            
            resolve(result)
        })
        .catch(() =>{
            reject(error)
        })

    })
    
}


module.exports = { getModules, getStudents, deleteStudent, editModule, getStudent, getOneModule }
