const Splitbill = require("../models/splitbillModel");
const User = require("../models/userModel");
const Group = require("../models/groupModel");
const Expense = require("../models/expenseModel");


//fetching data from API
const split = async (req,res)=>{

    //creating list of expenses detail
    var expenses = [];

    //creating a flag to validate percentage split
    var flag= 0;

    //storing body response
    const newSplitBill = new Splitbill(req.body);
    
    //finding group id
    const group = await Group.findById(req.body.gid);

    //validate if Payee belong to that group
    if(!group.members.includes(req.body.paidBy))
        return res.status(400).send({message: "Invalid payee!!"});
    
    //validate if group is empty 
    if(req.body.sharedBy.length==0)
        return res.status(400).send({message: "No Members in group!!"});

    //validate if members belong to that group
    for(let i =0; i<req.body.sharedBy.length; i++){
        if(!group.members.includes(req.body.sharedBy[i]))
            return res.send({message: "Invalid members in group!!"});
    }
    
    //updating the bill Data in database
    newSplitBill
    .save() 
    .catch((err)=>{
        res.status(400).json({result: "Error", message: `Failed to update data in database`});
    })

//calculating PERCENT, EQUAL, EXACT expense

    //calculating PERCENT expense
    if(req.body.expenseType == "PERCENT"){

            let percentSharingStructure = req.body.sharingStructure;
            let sharedBy = req.body.sharedBy;

            //validating if sum of percentage is 100%
            let sum =Object.values(percentSharingStructure).reduce((a,b)=>{
                return a+b;
            });
            if(sum != 100){
                flag = 1;
            }
            else{

            //calculating contro per sharedBy member
            for(let i=0;i<sharedBy.length;i++){
                
                //calculate contro upto 2 decimal places
                let amount = (((percentSharingStructure[sharedBy[i]])/100)*req.body.amount).toFixed(2);
                
                //json data store
                const expense= new Expense({
                    "groupId":req.body.gid,
                    "from":req.body.paidBy,
                    "to":sharedBy[i],
                    "amount":amount
                })

                expenses.push(expense);

                //saving data in dataBase
                expense
                .save()
                .catch((err)=>{
                    res.status(400).json({result: "Error", message: `Error is ${err}`});
                })
        
            }
        }
}//end of PERCENT expense

        //calculating EQUAL expense
        else if(req.body.expenseType == "EQUAL"){

            let sharedBy = req.body.sharedBy;

            //calculate contro upto 2 decimal places
            let amount = ((req.body.amount)/(sharedBy.length+1)).toFixed(2);

            //calculating contro per sharedBy member
            for(let i=0;i<sharedBy.length;i++){

                //json data store
                const expense = new Expense({
                    "groupId":req.body.gid,
                    "from":req.body.paidBy,
                    "to":sharedBy[i],
                    "amount":amount
                })
                expenses.push(expense);

                //saving data in dataBase
                expense
                .save()
                .catch((err)=>{
                    res.status(400).json({result: "Error", message: `Error is ${err}`});
                })
        
            }
        }//end of EQUAL expense

        //calculating EXACT expense
        else {
            let exactSharingStructure = req.body.sharingStructure;
            let sharedBy = req.body.sharedBy;

            //calculating contro per sharedBy member
            for(let i=0;i<Object.keys(exactSharingStructure).length;i++){
                let amount = exactSharingStructure[sharedBy[i]];

                //json data store
                const expense= new Expense({
                    "groupId":req.body.gid,
                    "from":req.body.paidBy,
                    "to":sharedBy[i],
                    "amount":amount
                    
                })
                expenses.push(expense);
                
                //saving data in dataBase
                expense
                .save()
                .catch((err)=>{
                    res.status(400).json({result: "Error", message: `Error is ${err}`});
                })
            }
        }//end of EXACT expense
        
       // sending success response
       if(flag!=1){
        res.status(200).json({
            result: "Success",
            message: `Split Bill Info Updated Successfully`,
            expenses:expenses
        }) 
       }
       else{
        res.status(402).send("Sum of entered percentages is not 100. Please enter complete details")
       }
}

//exporting controller
module.exports = {split};
