const Op = require('sequelize').Op;

const statusCodes = require('../../util/status-codes');
const jsonHelper = require('../../util/json-helper');
const utils = require("../../util/helper-functions");

const Contact = require("../../models/contact");
const ContactView = require("../../models/contact-view");

exports.incrementContactViewCount = async (req,res,next)=>{
  try{
      const contactId = req.params.contactId;
      const date = req.body.date;
      const user = req.user;
      if(!user){
          const error = new Error("User Not Found");
          error.error = "User Null";
          error.statusCode = statusCodes.NO_CONTENT;
          throw error;
      }
      const contact = await Contact.findOne({
          where:{
              id: contactId
          }
      });
      if(!contact){
          const error = new Error("Contact Not Found");
          error.error = "User Null";
          error.statusCode = statusCodes.NO_CONTENT;
          throw error;
      }
      const view = await ContactView.findOne({
          where:{
              [Op.and]:[
                  {contactId: contactId},
                  {date:new Date(date)},
              ]
          }
      });
      if(!view){
           await contact.createContactView({
              date: new Date(date),
              views_count: 1,
              created_at: utils.getIstTimeStampUnix(),
              updated_at: utils.getIstTimeStampUnix()
          })
      }else{
          // Just Update the count
          await  ContactView.update({
              views_count: view.views_count+1,
              updated_at: utils.getIstTimeStampUnix()
          }, {
              where: {
                  id: view.id
              }
          })
      }
      res.json(jsonHelper(
          statusCodes.OK,
          "View count updated successfully",
      ))
  } catch (err) {
      next(err)
  }
};


exports.viewCount = async (req,res,next)=>{
    try{
        const contactId = req.params.contactId;
        const dates = req.body.date;
        if(!req.user){
            const error = new Error("User Not Found");
            error.error = "User Null";
            error.statusCode = statusCodes.NO_CONTENT;
            throw error;
        }
        let views = [];
        for(let date of dates){
            const count = await  ContactView.findOne({
                where:{
                    [Op.and]:{
                        contactId: contactId,
                        date:new Date(date)
                    }
                }, attributes:['views_count']
            });
            views.push({
                date: date,
                count:count ? count["views_count"] : null
            })
        }

        res.json(jsonHelper(
            statusCodes.OK,
            "Count fetched successfully",
            views
        ))
    }catch(err){
        next(err)
    }
};

exports.totalViewCount = async (req,res,next)=>{
  try{
      const contactId = req.params.contactId;
      if(!req.user){
          const error = new Error("User Not Found");
          error.error = "User Null";
          error.statusCode = statusCodes.NO_CONTENT;
          throw error;
      }
      let totalCount = 0;
      const views = await  ContactView.findAll({
          where:{
              contactId: contactId
          },
          attributes:['views_count']
      });
      for(const view of views){
            totalCount += view.views_count
      }
      res.json(jsonHelper(
          statusCodes.OK,
          "Total count fetched successfully",
          totalCount
      ))
  } catch (err) {
      next(err)
  }
};