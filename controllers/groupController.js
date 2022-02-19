const Group = require("../models/groupModel");
const User = require("../models/userModel");

//function to create new group 

const creategroup = async (req,res)=>{
    let members = req.body.members;
    members.push(req.params.userId);
    const newGroup = new Group(
        {
            "gname": req.body.gname,
            "members": members
        }
    );
    newGroup
    .save()
    .then((group)=>{
        res.status(200).json({
            result: "Success",
            group: newGroup,
            message: `Group created Successfully.`
        })
    })
    .catch((err)=>{
        res.status(400).json({result: "Error", message: `Some Error Occured..`});
    })
    
}

//fetching all the groups
const fetchGroup = (req, res) => {
    Group.find({}, (err, group) => {
      res.send(group);
    });
  };

module.exports = {fetchGroup, creategroup};
