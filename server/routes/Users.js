const express = require('express');
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcryptjs");
const {sign} = require("jsonwebtoken");
const {validateToken, authPage} = require("../middlewares/AuthMiddleware");
//const cookieParser = require("cookie-parser");


function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validateName(name) {
    if(name.length <= 2 || name.length > 250){
        return false;
    }
    return true;
}

function validatePassword(password) {
    if(password.length <= 4 || password.length > 200){
        return false;
    }
    return true;
}


function validateRole(role) {
    if(!(role === 'Employer' || role === 'Employee' || 
    role === 'Admin' )){
        return false;
    }
    return true;
}

function validateProvince(province) {
    if(!(province === 'QC' || province=== 'ON' || 
    province === 'BC' )){
        return false;
    }
    return true;
}

function validateCity(city) {
    if(city.length <= 2 || city.length > 200){
        return false;
    }
    return true;
}




// route for registeration 
router.post("/", async (req,res) => {
    const newUser = req.body;
    const {email,password,name,role,province,city} = req.body;

    if(!validateEmail(newUser.email)) {
        res.json({error: "Invalid Email format"})
        return;
    }
    if(!validateName(newUser.name)) {
        res.json({error: "Name must be between 2-200 characters"})
        return;
    }
    if(!validatePassword(newUser.password)) {
        res.json({error: "Password must be between 4-200 characters"})
        return;
    }
    if(!validateRole(newUser.role)) {
        res.json({error: "You should choose at least one role "})
        return;
    }
    if(!validateProvince(newUser.province)) {
        res.json({error: "You should choose one of the provinces"})
        return;
    }
    if(!validateCity(newUser.city)) {
        res.json({error: "City must be between 2-200 characters"})
        return;
    }
    const result = await Users.findOne({where: {email: newUser.email}});
    if(result) {
        res.send({error: "This Email is already registered"});
        return;
    } else{
            bcrypt.hash(password,10).then((hash) => {
        Users.create({
            email: email,
            password: hash,
            name: name,
            role: role,
            province: province,
            city: city
        });
        res.json("success");
    });
    }


});

router.get("/", validateToken, authPage("Admin"), async (req, res) => {
    const listOfUsers = await Users.findAll();
    res.json(listOfUsers);
  });

  router.get("/auth", validateToken, (req, res)=>{
    res.json(req.user);
});


  router.post("/login", async (req,res) => {
    const {email,password} = req.body;
    const user = await Users.findOne({ where: { email: email}});
    //const verifyRoles = require('../middlewares/verifyRoles');

    if(!user)
     {res.json({error: "Wrong username and password combination, Please try again!"})
     return;
    };
    
    bcrypt.compare(password, user.password).then((match) => {
        if(!match) {res.json({error: "Wrong username and password combination!"}); 
        return;}
        
        const accessToken = sign(
            {email: user.email, id: user.id, role: user.role, name: user.name },
            "importantsecret"
        );
        res.json({token: accessToken, email: email, id: user.id, role: user.role, name: user.name});
    });
});

router.get("/manageusers", validateToken, authPage("Admin"), async (req, res) => {

    const listOfUsers = await Users.findAll();
    res.json(listOfUsers);
  });

  router.get("/manageusers/:userId([0-9]+)",validateToken, authPage("Admin"), async (req, res) => {
    const userId = req.params.userId;
    const currentUser = await Users.findByPk(userId);
    res.json(currentUser);
  });

router.delete("/manageusers/:userId([0-9]+)",validateToken, authPage("Admin"), async (req, res) => {
    const userId = req.params.userId;
  await Users.destroy({
    where: {
      id: userId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

router.put("/manageusers/:id([0-9]+)", validateToken, authPage("Admin"), async (req, res) => {
    const userId = req.params.id;
    const newUser = req.body;
    const result = await Users.findOne({where: {email: newUser.email}});



    if(result){

     if(result.id != userId) {
         console.log("resultId" + result.id)
         console.log("userId" + userId)
         return res.json({error: "This Email is already existed!"});
         }
    }
    if(!validateEmail(newUser.email)) {
        res.json({error: "Invalid Email format"})
        return;
    }
    if(!validateName(newUser.name)) {
        res.json({error: "Name must be between 2-200 characters"})
        return;
    }
    if(!validatePassword(newUser.password)) {
        res.json({error: "Password must be between 4-200 characters"})
        return;
    }
    if(!validateRole(newUser.role)) {
        res.json({error: "You should choose at least one role "})
        return;
    }
    if(!validateProvince(newUser.province)) {
        res.json({error: "You should choose one of the provinces"})
        return;
    }
    if(!validateCity(newUser.city)) {
        res.json({error: "City must be between 2-200 characters"})
        return;
    }
    else{
    await bcrypt.hash(req.body.password,10).then((hash) => {
        Users.update(
            {
                email: req.body.email,
                // password: hash,
                name: req.body.name,
                role: req.body.role,
                province: req.body.province,
                city: req.body.city
              },
                { where: { id: userId } });
    });
    res.json(newUser);}
  });

  //********************** User Update Personal Info ******************************/
  router.get("/account/:userId([0-9]+)", validateToken, async (req, res) => {
    const mainUserId = req.user.id;
    const currentUserId = req.params.userId;
    if(currentUserId != mainUserId){
        res.json({error: "You do not have access to this account"});
        return;
    }else{
    const currentUser = await Users.findByPk(currentUserId);
    res.json(currentUser);}
  });


  router.put("/updateaccount/:id([0-9]+)", validateToken, async (req, res) => {
    const mainUserId = req.user.id;
    const currentUserId = req.params.id;
    const email = req.body.email;

    

    if(currentUserId != mainUserId){
        
        res.json({error: "You do not have access to this account"});
        return;
    }
    else{

        const result = await Users.findOne({where: {email: email}});

        if(result){
            if(result.id != mainUserId) {
                return res.json({error: "This Email is already existed!"});
                }
           }

    await bcrypt.hash(req.body.password,10).then((hash) => {
        Users.update(
            {
                email: req.body.email,
                password: hash,
                name: req.body.name,
                role: req.user.role,
                province: req.body.province,
                city: req.body.city
              },
                { where: { id: currentUserId } }); 
    });
    res.json("Updated Successfully");
   }  
   
  });




module.exports = router;