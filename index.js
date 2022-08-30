var express = require ('express')
var mySQLDAO = require('./mySQLDAO')
var res = require('express/lib/response')
var app = express() 
var ejs = require('ejs')
var bodyParser = require('body-parser')
var mongoDAO = require('./mongoDAO')
const credits = [5, 10, 15]
const { body, validationResult, check} = require('express-validator')

app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'ejs')

app.get('/', (req, res)=>{

   res.render('home')
   
})
//get request to list all modules from database
app.get('/modules',(req,res)=>{

    mySQLDAO.getModules()
    .then((result)=>{
       // console.log(result)
       res.render('showModules', {courses:result})
       // resolve(result)
    })

    .catch((error)=>{
        res.send(error)
       // reject(error)
    })

})

//get request to list all students from database 
app.get('/students', (req, res)=>{

    mySQLDAO.getStudents()
    .then((result)=>{
        console.log(result)
        res.render('showStudents', {students:result})
    })

    .catch((error)=>{
        res.send(error)
    })
})


//get request 
//  app.get('/editModule', (req, res)=> {

//      res.render('editModules')
//  })

app.get('/editModule', (req, res) =>{

    mySQLDAO.getOneModule(req.params.mid)

    .then((result) =>{
        console.log(result)

        res.render('editModules', {errors:undefined, module:result})
    })
    .catch((error) =>{
        console.log(error)
    })
})

app.post('/editModule', 
[
    check('name').isLength({min:5}).withMessage("The module name has to be a minimum of 5 charachters"),
    check('credits').isIn(credits).withMessage("The credits should be eiter 5, 10 or 15")
],
(req, res) =>{
    var errors = validationResult(req)

    var moduleId = req.params.mid

    if(!errors.isEmpty()) {
        mySQLDAO.getOneModule(req.params.mid)

        .then((result) =>{
            console.log(result)

            res.render('/editModule', {errors:errors.errors, module:result})
        })
    }

    else{
        mySQLDAO.editModule(req.body.name, req.body.credits, moduleId)

        .then((result) =>{
            console.log(result)

            res.redirect('/modules')
        })
    }
})

//  app.post('/editModule', (req, res) =>{


//      var moduleId = req.params.mid
//      console.log(req.body)
//      mySQLDAO.editModule(req.body.name, req.body.credits, moduleId)
//     // res.send("Edit Module post received")
//      res.redirect('/modules')
//  })

app.get('/deleteStudent:sid', (req, res)=>{
    mySQLDAO.deleteStudent(req.params.sid)
    .then((result) =>{
        res.send(result)
    })
    .catch((error)=>{
        res.send(error)
    })
})

 app.get('/module/student/:mid', (req, res) =>{

     mySQLDAO.getStudent(req.params.mid)

     .then((result) =>{
         if (result.length > 0) {
             res.render('listOneStudent', {students:result, mid:req.params.mid})
         }
         else {
             res.render("midError", {mid:req.params.mid})
         }
     })
     .catch((error) => {
         res.send(error)
    })
 })

 app.get('/showLecturers', (req, res)=>{

    mongoDAO.getLecturers()

    .then((documents) =>{
        res.render('showLecturers', {lecturers:documents})
    })
    .catch((error)=>{
        res.send(error)
    })

 })

 app.get('/addLecturer', (req, res)=>{
    
    res.render('addLecturer', {errors:undefined, dupe:"", _id:"", name:"", dept:""})
 })

 app.post('/adddLecturer', 
 [
    check('_id').isLength({min:4, max:4}).withMessage("Lecturer ID must be 4 characters"),
    check('name').isLength({min:5}).withMessage("Name must be a min of 5 characters"),
    check('dept').isLength({min:3, max:3}).withMessage("Dept can only be 3 characters")
 ],
 
 (req, res) =>{
    var errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.render('addLecturer', {errors:errors.errors, dupe:"", _id:req.body._id, name:req.body.name, dept:req.body.dept})
    }
    else{
        mongoDAO.addLecturer(req.body._id, req.body.name, req.body.dept)
        
        .then((result) =>{
            //log result
            console.log(result)
            //redirect to show lecturer page
            res.redirect("/showLecturers")
        })
        .catch((error) =>{
            if(error.message.includes("11000"))
            {
                res.render('addLecturer', {errors:errors.errors, dupe:"ID already exists", _id:req.body._id, name:req.body.name, dept:req.body.dept})
            }
            else
            {
                res.send(error.message)
            }
        })
    }
 }
 )







app.listen(3000, ()=>{ 
    console.log("listening on port 3000")
})
