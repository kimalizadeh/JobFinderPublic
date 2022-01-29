const express = require('express');
const router = express.Router();
const { Wishlists, Applications, Users, Jobs } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");
const { response } = require('express');
const { Op } = require("sequelize");


router.post('/:jobId', validateToken, async (req, res) => {
    const JobId = req.params.jobId;
    const UserId = req.user.id;

    const found = await Wishlists.findOne({where: {
        JobId: JobId,
        UserId: UserId
    }, });


    if(!found) {

        await Wishlists.create({ JobId: JobId, UserId: UserId });
        res.json({ added: true });
        
    } else {

        await Wishlists.destroy({
            where: { JobId: JobId, UserId: UserId },
          });

          res.json({ added: false });

    }

})


router.get('/:jobId', validateToken, async (req, res) => {
    const JobId = req.params.jobId;
    const UserId = req.user.id;

    const wishlist = await Wishlists.findOne({where: {
        JobId: JobId,
        UserId: UserId
    }, });

    if(wishlist) {
        res.json({added: true})
    } else {
        res.json({added: false})
    }

    
})

router.get('/', validateToken, async (req, res) => {
    const UserId = req.user.id;

    const wishlistItems = await Wishlists.findAll({where: {
        UserId: UserId,
    }, include: {
        model: Jobs, 
        where: {
            activated: true,
            expiryDate: {
                [Op.gte]: new Date(),
            }  
        }, include: {
            model: Applications,
            where: {
                UserId : UserId
            },
            required: false
        }
    }});

    res.json(wishlistItems);

})

router.delete("/:id", validateToken, async (req, res) => {
    const id = req.params.id;
  
    await Wishlists.destroy({
      where: {
        id: id,
      },
    });
  
    res.json("DELETED SUCCESSFULLY");
  });



module.exports = router;