const express = require('express');
const path = require("path");
const hbs = require("hbs");
const bcrypt = require('bcryptjs')
require("./db/conn");
const Register = require('./models/userreg');
const app = express();
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, '../public');
const template_path = path.join(__dirname, '../templates/views');
const partials_path = path.join(__dirname, '../templates/partials');


app.use(express.static(static_path));
app.set("view engine", "hbs")
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/index", (req, res) => {
    res.render("index")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/index", async(req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if(password === cpassword){
             const registerEmployee = new Register({
                 email: req.body.email,
                 password: req.body.password,
                 cpassword: req.body.cpassword

             })

             const token = await registerEmployee.generateAuthToken();

             

             const registered = await registerEmployee.save();
             res.status(201).render("index");
        }else{
            res.send("passwords do not match");
        }
    } catch (error) {
        res.status(400).send(error);
        
    }
})

//login post
app.post("/login", async(req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password
     
        

      const usermail= await Register.findOne({email:email});  

      const isMatch = await bcrypt.compare(password, usermail.password);
      const token = await usermail.generateAuthToken();


      if(isMatch){
          res.status(201).render('index');
      }
      else{
          res.send("invalid login details");
      }


    } catch (error) {
        res.status(400).send("invalid email")
    }
})


// app.post('/students', async(req,res) => {
    
//     try {
//         const user = new Student(req.body)
//         const createUser = await user.save();
//           res.status(201).send(createUser);

//     } catch (e) {
//         res.status(400).send(e);
//     }
    
    
// })

// app.get('/students', async(req,res) => {
    
//     try {
//         const user = new Student(req.body)
//         const StudentsData = await Student.find();
//           res.send(StudentsData);
          
//     } catch (e) {
//         res.send(e);
//     }
    
    
// })

app.listen(port, () =>{
    console.log(`running at port ${port}`);
})