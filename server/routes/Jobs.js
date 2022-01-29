const express = require('express');
const router = express.Router();
const {validateToken, authPage} = require("../middlewares/AuthMiddleware");
const { Jobs, Applications, Wishlists } = require("../models");
const { Op } = require("sequelize");



function validateJobTitle(jobTitle) {
    if(jobTitle.length < 5 || jobTitle.length > 250){
        return false;
    }
    return true;
}

function validateCompany(company) {
    if(company.length < 2 || company.length > 200){
        return false;
    }
    return true;
}

function validateSalary(salary) {
    if(parseInt(salary) <= 0 || parseInt(salary) > 1000000){
        return false;
    }
    return true;
}

function validateCategory(category) {
    if(!(category === 'IT' || category === 'Business' || 
    category === 'Finance' || category === 'General' || category === 'Engineering' 
    || category === 'Art' )){
        return false;
    }
    return true;
}

function validateJobType(jobType) {
    if(!(jobType === 'Full-Time' || jobType === 'Part-Time' || 
    jobType === 'Contract' )){
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
    if(city.length < 2 || city.length > 200){
        return false;
    }
    return true;
}

function validateDescription(description) {
    if(description.length < 2 || description.length > 5000){
        return false;
    }
    return true;
}

function validateExpirtyDate(expiryDate) {
    const expiryDateParsed = Date.parse(expiryDate)
    const now = new Date();

    if(expiryDateParsed < now){
        return false;
    }
    return true;
}

function checkProvince(province) {
    if(province === "All") {
        return province = `%`;
    }
    return province
}

function checkJobType(jobType) {
    if(jobType === "All") {
        return jobType = `%`;
    }
    return jobType;
}

function checkCategory(category) {
    if(category === "All") {
        return category = `%`;
    }
    return category; 
}

 

router.post("/", validateToken, authPage(["Admin","Employer"]), async (req, res) => {
    console.log(req.body.expiryDate);
    console.log(req.body.description);

    const job = req.body;

    if(!validateJobTitle(job.jobTitle)) {
        res.json({error: "Job title must be between 5-250 characters"})
        return;
    }
    if(!validateCompany(job.company)) {
        res.json({error: "Company must be between 2-200 characters"})
        return;
    }
    if(!validateSalary(job.salary)) {
        res.json({error: "Salary must be greater than 0 and less than $1,000,000"})
        return;
    }
    if(!validateCategory(job.category)) {
        res.json({error: "Invalid category"}) 
        return;
    }
    if(!validateJobType(job.jobType)) {
        res.json({error: "Invalid job type"})
        return;
    }
    if(!validateProvince(job.province)) {
        res.json({error: "Invalid job province"})
        return;
    }
    if(!validateCity(job.city)) {
        res.json({error: "City must be between 2-200 characters"})
        return;
    }
    if(!validateDescription(job.description)) {
        res.json({error: "Description must be between 2-5000 characters"})
        return;
    }

    if(!validateExpirtyDate(job.expiryDate)) {
        res.json({error: "Expiry date must be in the future"})
        return;
    }

    job.activated = true;
    job.UserId = req.user.id;

    await Jobs.create(job);
    res.json(job);

});

//   ************************** Admin CRUD  ********************************
router.get("/admin/:id([0-9]+)",validateToken, authPage("Admin"), async (req, res) => {
    const jobId = req.params.id;
    const currentJob= await Jobs.findByPk(jobId);
    res.json(currentJob);
  });

router.get("/admin/jobs",validateToken,authPage("Admin"), async (req, res) => {

    const listOfJobs = await Jobs.findAll({where: {
        activated: true,
        expiryDate: {
            [Op.gte]: new Date(),
        } 
    },  include: [Applications]});
    res.json(listOfJobs);
  });


router.delete("/admin/jobs/:jobId([0-9]+)",validateToken, authPage("Admin"), async (req, res) => {
    const jobId = req.params.jobId;
  await Jobs.destroy({
    where: {
      id: jobId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

router.put("/admin/:jobId([0-9]+)", validateToken, authPage("Admin"), async (req, res) => {
    const jobId = req.params.jobId;

    const currentJob= await Jobs.findByPk(jobId);
    //const newDes = req.body;
    const job = req.body;

    if(!validateJobTitle(job.jobTitle)) {
        res.json({error: "Job title must be between 5-250 characters"})
        return;
    }
    if(!validateCompany(job.company)) {
        res.json({error: "Company must be between 2-200 characters"})
        return;
    }
    if(!validateSalary(job.salary)) {
        res.json({error: "Salary must be greater than 0 and less than $1,000,000"})
        return;
    }
    if(!validateCategory(job.category)) {
        res.json({error: "Invalid category"}) 
        return;
    }
    if(!validateJobType(job.jobType)) {
        res.json({error: "Invalid job type"})
        return;
    }
    if(!validateProvince(job.province)) {
        res.json({error: "Invalid job province"})
        return;
    }
    if(!validateCity(job.city)) {
        res.json({error: "City must be between 2-200 characters"})
        return;
    }
    if(!validateDescription(job.description)) {
        res.json({error: "Description must be between 2-5000 characters"})
        return;
    }

    if(!validateExpirtyDate(job.expiryDate)) {
        res.json({error: "Expiry date must be in the future"})
        return;
    }

    await Jobs.update(
            {
                jobTitle: req.body.jobTitle,
                company: req.body.company,
                salary: req.body.salary,
                category: req.body.category,
                jobType: req.body.jobType,
                province: req.body.province,
                city: req.body.city,
                description: req.body.description,
                expiryDate: req.body.expiryDate,
                activated: true,
                UserId:req.user.id
              },
                { where: { id: jobId } });
    res.json(currentJob);
  });


  
  

  //   ************************** Employer CRUD  ********************************

  router.get("/employer/:userId([0-9]+)",validateToken, authPage("Employer"), async (req, res) => {
     const CurrentUserId = req.user.id;
        const UserId = req.user.id;
        const jobs = await Jobs.findAll({where: {
            UserId: UserId,
            activated: true,
            expiryDate: {
                [Op.gte]: new Date(),
            } 
        },  include: [Applications]});
        res.json(jobs);
    //}
  });

  router.get("/employer/job/:id([0-9]+)",validateToken, authPage("Employer"), async (req, res) => {
    const jobId = req.params.id;
    const currentJob= await Jobs.findByPk(jobId);
    if(currentJob.UserId != req.user.id){
       return res.json({error: "You do not have access to this job"});
    }else{
    res.json(currentJob);
    }
  });

  router.delete("/employer/:jobId([0-9]+)",validateToken, authPage("Employer"), async (req, res) => {
    const jobId = req.params.jobId;
  await Jobs.destroy({
    where: {
      id: jobId,
    },
  });

  res.json("DELETED SUCCESSFULLY");
});

router.put("/employer/:jobId([0-9]+)",validateToken, authPage("Employer"), async (req, res) => {
    const jobId = req.params.jobId;
    const currentJob= await Jobs.findByPk(jobId);
    if(currentJob.UserId != req.user.id){
       return res.json({error: "You do not have access to this job"});
    }
    
    const job = req.body;

    if(!validateJobTitle(job.jobTitle)) {
        res.json({error: "Job title must be between 5-250 characters"})
        return;
    }
    if(!validateCompany(job.company)) {
        res.json({error: "Company must be between 2-200 characters"})
        return;
    }
    if(!validateSalary(job.salary)) {
        res.json({error: "Salary must be greater than 0 and less than $1,000,000"})
        return;
    }
    if(!validateCategory(job.category)) {
        res.json({error: "Invalid category"}) 
        return;
    }
    if(!validateJobType(job.jobType)) {
        res.json({error: "Invalid job type"})
        return;
    }
    if(!validateProvince(job.province)) {
        res.json({error: "Invalid job province"})
        return;
    }
    if(!validateCity(job.city)) {
        res.json({error: "City must be between 2-200 characters"})
        return;
    }
    if(!validateDescription(job.description)) {
        res.json({error: "Description must be between 2-5000 characters"})
        return;
    }

    if(!validateExpirtyDate(job.expiryDate)) {
        res.json({error: "Expiry date must be in the future"})
        return;
    }
    
    
    else{
    await Jobs.update(
            {
                jobTitle: req.body.jobTitle,
                company: req.body.company,
                salary: req.body.salary,
                category: req.body.category,
                jobType: req.body.jobType,
                province: req.body.province,
                city: req.body.city,
                description: req.body.description,
                expiryDate: req.body.expiryDate,
                activated: true,
                UserId: req.user.id
              },
                { where: { id: jobId } });
    res.json("Updated");}
  });


  router.put("/remove/:jobId([0-9]+)", validateToken, authPage(["Employer","Admin"]), async (req, res) => {
    const jobId = req.params.jobId;
    const job = await Jobs.findByPk(jobId);
    await job.update({ 
        activated: false
    });

  res.json("REMOVED SUCCESSFULLY");
});


router.get("/", validateToken, async (req, res) => {
    const UserId = req.user.id;
    const jobs = await Jobs.findAll({where: {
        UserId: UserId,
        activated: true,
        expiryDate: {
            [Op.gte]: new Date(),
        } 
    },  include: [Applications]});
    res.json(jobs);
});  

router.get("/:jobId", async (req, res) => {
    const jobId = req.params.jobId;
    const job = await Jobs.findByPk(jobId);
    res.json(job);
});


router.get("/search/:keyword/:province/:jobType/:category/:page([0-9]+)",  async (req, res) => {
    const keyword = req.params.keyword;
    var province = req.params.province;
    var jobType = req.params.jobType;
    var category = req.params.category;
    const page = req.params.page;
    const size = 2;
    

    province = checkProvince(province);
    jobType = checkJobType(jobType);
    category = checkCategory(category);


    const skip = (page - 1) * size;

    const list = await Jobs.findAll({where: {
        expiryDate: {
            [Op.gte]: new Date(),
        },
        activated: true,
        province: {
            [Op.like]: province

        },
        jobType: {
            [Op.like]: jobType

        },
        category: {
            [Op.like]: category

        },
        [Op.or] : [
            { jobTitle : {
                [Op.like]: `%${keyword}%`
            }
        }, { company: {
            [Op.like]: `%${keyword}%`
        }
        }, { description: {
            [Op.like]: `%${keyword}%`
        }
        }, 
        { city: {
            [Op.like]: `%${keyword}%`
        }
        },
        { salary: {
            [Op.like]: `%${keyword}%`
        }
        },  

    ], 

    }});
    
    const total = list.length;


    const jobs = await Jobs.findAll({where: {
        expiryDate: {
            [Op.gte]: new Date(),
        },
        activated: true,
        province: {
            [Op.like]: province

        },
        jobType: {
            [Op.like]: jobType

        },
        category: {
            [Op.like]: category

        },
        [Op.or] : [
            { jobTitle : {
                [Op.like]: `%${keyword}%`
            }
        }, { company: {
            [Op.like]: `%${keyword}%`
        }
        }, { description: {
            [Op.like]: `%${keyword}%`
        }
        },
        { city: {
            [Op.like]: `%${keyword}%`
        }
        },
        { salary: {
            [Op.like]: `%${keyword}%`
        }
        },   

    ], 

    }, offset: skip, limit: size });


    res.json({total: total, jobs: jobs});   
});


router.get("/search/:province/:jobType/:category/:page([0-9]+)",  async (req, res) => {
    var province = req.params.province;
    var jobType = req.params.jobType;
    var category = req.params.category;
    const page = req.params.page;
    const size = 2;

    province = checkProvince(province);
    jobType = checkJobType(jobType);
    category = checkCategory(category);
    console.log("here");
    console.log(province);
    console.log(jobType);
    console.log(category);

    
    const skip = (page - 1) * size;

    const list = await Jobs.findAll({where: {
        expiryDate: {
            [Op.gte]: new Date(),
        },
        activated: true,
        province: {
            [Op.like]: province

        },
        jobType: {
            [Op.like]: jobType

        },
        category: {
            [Op.like]: category

        },
        
        
    }});
    
    const total = list.length;


    const jobs = await Jobs.findAll({where: {
        expiryDate: {
            [Op.gte]: new Date(),
        },
        activated: true,
        province: {
            [Op.like]: province

        },
        jobType: {
            [Op.like]: jobType

        },
        category: {
            [Op.like]: category

        },


    }, offset: skip, limit: size });


    res.json({total: total, jobs: jobs});   
});

router.get("/auth/search/:province/:jobType/:category/:page([0-9]+)", validateToken, async (req, res) => {
    const UserId = req.user.id;
    var province = req.params.province;
    var jobType = req.params.jobType;
    var category = req.params.category;
    const page = req.params.page;
    const size = 2;

    province = checkProvince(province);
    jobType = checkJobType(jobType);
    category = checkCategory(category);

    const skip = (page - 1) * size;

    const list = await Jobs.findAll({where: {
        expiryDate: {
            [Op.gte]: new Date(),
        },
        activated: true,
        province: {
            [Op.like]: province

        },
        jobType: {
            [Op.like]: jobType

        },
        category: {
            [Op.like]: category

        },
    }});
    
    const total = list.length;


    const jobs = await Jobs.findAll({where: {
        expiryDate: {
            [Op.gte]: new Date(),
        },
        activated: true,
        province: {
            [Op.like]: province

        },
        jobType: {
            [Op.like]: jobType

        },
        category: {
            [Op.like]: category

        },


    }, include: [{
        model: Applications,
        where: {
            UserId: UserId
        }, required: false
    }, 
    {
        model: Wishlists,
        where: {
            UserId: UserId
        }, required: false

    }, 
    ],
    offset: skip, limit: size });


    res.json({total: total, jobs: jobs});   
});


router.get("/auth/search/:keyword/:province/:jobType/:category/:page([0-9]+)", validateToken, async (req, res) => {
    const UserId = req.user.id;
    const keyword = req.params.keyword;
    var province = req.params.province;
    var jobType = req.params.jobType;
    var category = req.params.category;
    const page = req.params.page;
    const size = 2;

    province = checkProvince(province);
    jobType = checkJobType(jobType);
    category = checkCategory(category);

    const skip = (page - 1) * size;

    const list = await Jobs.findAll({where: {
        expiryDate: {
            [Op.gte]: new Date(),
        },
        activated: true,
        province: {
            [Op.like]: province

        },
        jobType: {
            [Op.like]: jobType

        },
        category: {
            [Op.like]: category

        },
        [Op.or] : [
            { jobTitle : {
                [Op.like]: `%${keyword}%`
            }
        }, { company: {
            [Op.like]: `%${keyword}%`
        }
        }, { description: {
            [Op.like]: `%${keyword}%`
        }
        },
        { city: {
            [Op.like]: `%${keyword}%`
        }
        },
        { salary: {
            [Op.like]: `%${keyword}%`
        }
        },   

    ], 

    }});
    
    const total = list.length;


    const jobs = await Jobs.findAll({where: {
        expiryDate: {
            [Op.gte]: new Date(),
        },
        activated: true,
        province: {
            [Op.like]: province

        },
        jobType: {
            [Op.like]: jobType

        },
        category: {
            [Op.like]: category

        },
        [Op.or] : [
            { jobTitle : {
                [Op.like]: `%${keyword}%`
            }
        }, { company: {
            [Op.like]: `%${keyword}%`
        }
        }, { description: {
            [Op.like]: `%${keyword}%`
        }
        }, 
        { city: {
            [Op.like]: `%${keyword}%`
        }
        }, 
        { salary: {
            [Op.like]: `%${keyword}%`
        }
        }, 

    ], 

    }, include: [{
        model: Applications,
        where: {
            UserId: UserId
        }, required: false
    }, 
    {
        model: Wishlists,
        where: {
            UserId: UserId
        }, required: false

    }, 
    ],
    
    offset: skip, limit: size });


    res.json({total: total, jobs: jobs});   
});


module.exports = router; 

 
