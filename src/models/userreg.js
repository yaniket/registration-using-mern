const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
        // validate(val){
        //     if(!validator.isEmail(val)){
        //            throw new Error("Invalid email");
        //     }
        //  }
        
    },
     
    password:{
        type:String,
        required:true,
        unique:true
        
    },

    cpassword:{
        type:Number,
        required: true
        
    },

    tokens: [{
      
        token:{
            type:String,
            required:true

        }
    }]

})

//Middleware
// generating tokens
employeeSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id}, "mynameisaniketyadavdoing");
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
        console.log(token)
    } catch (error) {
        res.send('error occured');
        console.log(`error occured ${error}`);
    }
}

employeeSchema.pre("save", async function(next){
    // const passwordHash = await bcrypt.hash(password, 10);
    if(this.isModified('password')){
 
    this.password = await bcrypt.hash(this.password, 10 );
    this.cpassword = await bcrypt.hash(this.password, 10 );


    // this.cpassword = undefined;
    }
    next();
})


const Register = new mongoose.model('Register', employeeSchema);

module.exports = Register;


