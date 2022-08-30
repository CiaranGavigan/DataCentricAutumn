const { MongoClient } = require('mongodb');
const { resolve, reject } = require('promise');
const url = 'mongodb://localhost:27017';

const dbName = "lecturersdb"
const collName = "lecturers"

var lecturersDB
var lecturers

var sort = {_id: 1}

MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

.then((client) =>{

    lecturersDB = client.db(dbName)

    lecturers = lecturersDB.collection(collName)
})
.catch((error) =>{
    console.log(error)
})

//function to get lecturer info from mongo
var getLecturers = function() {

    return new Promise((resolve, reject) =>{
        //takes all lecturers from collection and displays and sorts
        var cursor = lecturers.find().sort(sort)
        //send lecturers to array
        cursor.toArray()

        .then((documents) => {
            //resolve result
            resolve(documents)
        })
        .catch((error)=>{
            //catch error and reject it
            reject(error)
        })
    })
}

//function to add lecturer to mongo
var addLecturer = function (_id, name, dept){
    //return promise
    return new Promise((resolve, reject) =>{
        //insert lect id, name, dept into mongo
        lecturers.insertOne({"_id": _id, "name": name, "dept": dept})

        .then((result) =>{
            //resolve result
            resolve(result)

        })
        .catch((error) =>{
            //catches error and rejects it
            reject(error)
        })
    })
}

//var deleteLecturer = function (_id)

module.exports = {getLecturers, addLecturer}