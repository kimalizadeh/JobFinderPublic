const {verify} = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    if(!accessToken) return res.json({error : "User not Logged in"});

   try{
        const validToken = verify(accessToken, "importantsecret");
        req.user = validToken;

        if(validToken){
            return next();
        }
    }catch(err){
        return res.json({error: err});
    }
}; 

// const validateAdminRole =(req, res, next) => {
//     const accessToken = req.header("accessToken");

//     if(!accessToken.role) {return res.json({error : "User not Logged in"});}
//     else {return(next())}
// };


const authPage = (Permissions) => {
    return(req, res, next) => {
        const accessToken = req.header("accessToken");
        const userRole = jwt.decode(accessToken).role;
        if(Permissions.includes(userRole)){
            next();
        } else{
            //return res.this.status(401).json("You do not have access to this page!");
            return res.json("You do not have access to this page!");
        }
    }
}; 


module.exports = { validateToken , authPage};


// const { sign, verify } = require("jsonwebtoken");

// const createTokens = (user) => {
//   const accessToken = sign(
//     { email: user.email, id: user.id },
//     "jwtsecretplschange"
//   );

//   return accessToken;
// };

// const validateToken = (req, res, next) => {
//   const accessToken = req.cookies["access-token"];

//   if (!accessToken)
//     return res.status(400).json({ error: "User not Authenticated!" });

//   try {
//     const validToken = verify(accessToken, "jwtsecretplschange");
//     if (validToken) {
//       req.authenticated = true;
//       return next();
//     }
//   } catch (err) {
//     return res.status(400).json({ error: err });
//   }
// };

// module.exports = { createTokens, validateToken };

