const express = require('express');
const router = express.Router();
const { Applications, Users, Jobs } = require("../models");
// const multer  = require('multer');
// const upload = multer({ dest: 'uploads/' })
const fileUpload = require('express-fileupload');
var fs = require('fs');
const path = require("path");
const {validateToken, authPage} = require("../middlewares/AuthMiddleware");
var nodemailer = require('nodemailer');
const { Op } = require("sequelize");


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAILUSER,
      pass: process.env.EMAILPASS
    }
  });




// router.use(fileUpload({
//     limits: {
//         fileSize: 1024 * 1024 // 1 MB
//     },
//     abortOnLimit: true
//  })); 

//initialize middleware
 router.use(fileUpload()); 


router.post("/:jobId([0-9]+)", validateToken, async (req, res) => {

    const jobId = req.params.jobId;
    var insertdata = {};
    insertdata["resume"]= req.files.resume.data
    insertdata["experience"]= req.body.experience;
    insertdata["education"]= req.body.education;
    insertdata["UserId"]= req.user.id;
    insertdata["removed"]= false;
    insertdata["JobId"]= jobId;

    const extensionName = path.extname(req.files.resume.name); // fetch the file extension
    const allowedExtension = ['.pdf'];

    if(req.files.resume.size > 1024 * 1024 ) {
        return res.json({error: "Max file size is 1MB"});
    };

    if(!allowedExtension.includes(extensionName)){
        return res.json({error: "Resume must be a pdf"});
    } else {
        await Applications.create(insertdata);

        var mailOptions = {
            from: process.env.EMAILUSER,
            to: process.env.EMAILUSER,
            subject: 'Application Received',
            text: "We have received your job application!"
          };
        
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });  

        res.json("success");
    }

});

router.get('/:id([0-9]+)', async (req, res) => {
    const id = req.params.id;
    const application = await Applications.findByPk(id);
    if (application) {
        res.end(application.resume);
    } else {
        res.end('No Img with that Id!');
    }
})



router.get('/list/:jobId([0-9]+)',  async (req, res) => {
    const jobId = req.params.jobId;
    const applications = await Applications.findAll({where: {
        JobId: jobId,
    }, include: [Users, Jobs]});
    res.json(applications);

})

router.get('/employee/:jobId', validateToken, async (req, res) => {
    const JobId = req.params.jobId;
    const UserId = req.user.id;

    const application = await Applications.findOne({where: {
        JobId: JobId,
        UserId: UserId
    }, });

    if(application) {
        //res.json({applied: false})
        res.json(application)
    } else {
        res.json({applied: false})
    }

    
})

//************ Update Employee Application********************/

router.get('/employeeapp/:applicationId([0-9]+)', validateToken, async (req, res) => {
    console.log("test");
    const applicationId = req.params.applicationId;
    const UserId = req.user.id;

    const application = await Applications.findOne({where: {
        id: applicationId,
        UserId: UserId
    }, });
    application.resume = {};
    console.log(application.id)
    
    if(application) {
        //res.json({applied: false})
        res.json(application)
    } else {
        res.json({applied: false})
    }

    
})

router.put("/:id([0-9]+)", validateToken, async (req, res) => {

    //TODO: CHECK IF JOB IS EXPIRED
    const applicationId = req.params.id;
    const currentApplication = await Applications.findOne({where: {id: applicationId}});
    var insertdate = {};
    // insertdate["resume"]= fs.readFileSync(req.file.path);
    insertdate["resume"]= req.files.resume.data
    insertdate["experience"]= req.body.experienceO
    insertdate["education"]= req.body.education;
    insertdate["UserId"]= req.user.id;
    //insertdate["JobId"]= currentApplication.JobId;

    const extensionName = path.extname(req.files.resume.name); // fetch the file extension
    const allowedExtension = ['.pdf'];

    if(req.files.resume.size> 1024 * 1024 ) {
        return res.json({error: "Max file size is 1MB"});
    };

    if(!allowedExtension.includes(extensionName)){
        return res.json({error: "Resume must be a pdf"});
    } else {
        await currentApplication.update({
            resume: req.files.resume.data,
            experience: req.body.experience,
            education: req.body.education,
            UserId: req.user.id
        }
            
        );


        res.json("success");
    }

});
///****************************Applications in Employee Dashboard ************************************ */
router.get("/employeedashboard/:userId([0-9]+)",validateToken, authPage("Employee") ,async (req, res) => {
    const userId = req.params.userId;
    const listOfApplications = await Applications.findAll({where: {UserId : userId
        },
        include: {
            model: Jobs, 
            where: {
                activated: true,
                expiryDate: {
                    [Op.gte]: new Date(),
                }  
            },
        }});
       //console.log(error);
    res.json(listOfApplications);
  });




// router.put("/remove/:applicationId", validateToken, authPage("Employee"), async (req, res) => {
//     const applicationId = req.params.applicationId;
//     const application = await Applications.findByPk(applicationId);
//     await application.update({ 
//         removed: true
//     });

//   res.json("REMOVED SUCCESSFULLY");
// });

router.delete("/delete/:applicationId", validateToken, authPage("Employee"), async (req, res) => {
    const applicationId = req.params.applicationId;
   //const application = await Applications.findByPk(applicationId);
   await Applications.destroy({
    where: {
      id: applicationId,
    },
  });
  res.json("Deleted");

});



module.exports = router;