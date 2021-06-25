const mongoose = require ('mongoose');

const TransactionSchema = new mongoose.Schema({
    
    acc:{
        type : Number,
        required : true,
        trim : true
    },

    status:{
        type : String,
        required : true,
        enum : ["CREDITED" , "DEBITED"]
    },

    amount:{
        type : Number,
        required : true,
        trim : true
    },

    transferred_at:{
        type : Date,
        required : true,
        default : Date.now
    },

},{
    timestamps : true

});


const Transaction = mongoose.model('Transaction',TransactionSchema);

module.exports = Transaction;