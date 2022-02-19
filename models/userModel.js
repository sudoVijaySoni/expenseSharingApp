const mongoose = require("mongoose")

//defining Schema
const userSchema = mongoose.Schema({
    email:{
        type: String,
        require: true,
        unique: true,
    },
    fname:{
        type: String,
        require: true,
        trim: true
    },
    lname:{
        type: String,
        trim: true
    },
    mobile:{
        type: Number,
        require: true,
        unique: true,
        maxlength: 10,
        minlength: 10,
        match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/
    }
})

//exporting schema
module.exports = mongoose.model("User", userSchema);

