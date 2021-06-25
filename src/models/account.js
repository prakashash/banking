const mongoose = require ('mongoose');

const AccountSchema = new mongoose.Schema({
    
    customer_id:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        trim : true,
        ref : "Customer"
    },

    account_num:{
        type : Number,
        min : 10000,
        max : 99999,
        required : true,
        trim : true
    },

    account_type:{
        type : String,
        enum : ['CURRENT', 'SAVINGS'],
        default : 'SAVINGS'
    },

    balance:{
        type : Number,
        required : true,
        trim : true
    },

    created_at:{
        type : Date,
        required : true,
        default : Date.now
    },

},{
    timestamps : true

});


const Account = mongoose.model('Account',AccountSchema);

module.exports = Account;