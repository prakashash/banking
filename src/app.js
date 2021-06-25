require('./mongoose');


const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Customer = require('./models/customer');
const Transaction = require('./models/transaction');
const Account = require('./models/account');


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post("/api/customer", async (req, res) => {

    try {

        if ((!req.body.name) || (!req.body.email) || (!req.body.address) || (!req.body.mobile)) {
            res.status(400).send("Please enter all details")
            return;
        }
        var customer = new Customer(req.body);
        await customer.save()
        var accObj = {
            account_num: req.body.account_num,
            balance: req.body.balance,
            customer_id: customer._id

        }

        var account = new Account(accObj);
        await account.save()
        res.status(201).send({
            customer: customer,
            account: account
        })

    } catch (err) {
        console.log("=====", err)
        res.status(500).send("Internal server error")
    }

});

app.post("/api/account", async (req, res) => {
    try {

        req.body.customer_id = req.query.customer_id;
        var account = new Account(req.body);
        await account.save();
        res.status(201).send(account);

    } catch (err) {
        console.log("=====", err)
        res.status(500).send("Internal server error")

    }
})

app.post("/api/transaction", async (req, res) => {
    try {

        if ((!req.body.from_acc) || (!req.body.to_acc) || (!req.body.deposit)) {
            res.status(400).send("Please verify input details")
            return;
        }

        var fromAcc = await Account.findOne({
            account_num: req.body.from_acc
        })

        console.log("============", fromAcc)
        if (fromAcc.balance < req.body.deposit) {
            res.status(400).send("Insufficient balance")
            return;
        }

        await Account.findOneAndUpdate({ _id: fromAcc._id }, { $inc: { 'balance': - req.body.deposit } })
        await Account.findOneAndUpdate({ account_num: req.body.to_acc }, { $inc: { 'balance': req.body.deposit } })

        var transArr = [
            {
                acc: req.body.from_acc,
                status: "DEBITED",
                amount: req.body.deposit
            },
            {
                acc: req.body.to_acc,
                status: "CREDITED",
                amount: req.body.deposit
            }
        ]

        var transaction = await Transaction.insertMany(transArr);

        res.status(200).send({
            msg: "successfull",
            transaction: transaction
        })

    } catch (err) {
        res.status(500).send({
            msg: "Internal server error",
            err: err
        })
    }
})

app.get("/api/account", async (req, res) => {
    if (!req.query.account_num) {
        res.status(400).send("Please enter account number")
        return;
    }

    var account = await Account.findOne({
        account_num: req.query.account_num
    })
    if (!account) {
        res.status(400).send("Invalid account number")
        return;
    }
    res.status(200).send({
        balance: account.balance
    })
})

app.get("/api/transaction", async (req, res) => {
    if (!req.query.acc) {
        res.status(400).send("Please enter account number")
        return;
    }

    var transHistroy = await Transaction.find(req.query);

    const HistroyGroupedByStatus = groupBy(transHistroy, 'status');


    if (!transHistroy) {
        res.status(400).send("No transactions yet")
        return;
    }
    res.status(200).send({
        histroy: HistroyGroupedByStatus
    })
})

const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
        );
        return result;
    }, {});
};

app.listen('4000', () => {
    console.log("connected")
})

