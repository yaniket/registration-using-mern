const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/registerform", {
    useNewUrlParser: true,
    useCreateIndex:true,
    useUnifiedTopology: true
}).then(() =>{
    console.log("connected");
}).catch((e) =>{
    console.log("oops");
})