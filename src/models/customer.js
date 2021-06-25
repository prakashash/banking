const mongoose = require ('mongoose');

var statesArray = ['Pondy', 'Tamilnadu', 'Delhi', 'Kerala']

const CustomerSchema = new mongoose.Schema({
    name:{
        type : String,
        required : true,
        trim : true
    },

    email:{
        type : String,
        required : true,
        trim : true
    },

    address:{
        street: String,
        city: String,
        state: {
            type : String,
            required: true,
            enum : statesArray
        },
        zip: Number
    },

    mobile:{
        type : Number,
        min : 1000000000,
        max : 9999999999,
        required : true,
        trim : true,
        
    }
},{
    timestamps : true

});


const Customer = mongoose.model('Customter',CustomerSchema);

module.exports = Customer;