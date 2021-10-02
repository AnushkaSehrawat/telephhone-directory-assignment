const Op = require('sequelize').Op;

const statusCodes = require('../../util/status-codes');
const jsonHelper = require('../../util/json-helper');
const utils = require("../../util/helper-functions");

const Contact = require("../../models/contact");

exports.createContact = async (req,res,next)=>{
    try{
        if (utils.checkValidationError(req)) {
            throw utils.checkValidationError(req);
        }
        const firstName = req.body.first_name;
        const lastName = req.body.last_name;
        const middleName = req.body.middle_name;
        const email = req.body.email;
        const mobile = req.body.mobile;
        const landline = req.body.landline;
        const notes= req.body.notes;
        const user = req.user;
        if(!user){
            const error = new Error("User Not Found");
            error.error = "User Null";
            error.statusCode = statusCodes.NO_CONTENT;
            throw error;
        }
        const contact= await  user.createContact({
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            email:email,
            mobile: mobile,
            landline: landline,
            notes:notes,
            created_at: utils.getIstTimeStampUnix(),
            updated_at: utils.getIstTimeStampUnix()
        });
        res.json(jsonHelper(
            statusCodes.OK,
            "Contact created successfully",
            contact
        ));
    }catch(err){
        next(err);
    }

};

exports.detail = async (req,res,next)=>{
  try{
      const contactId = req.params.contactId
      if(!req.user){
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
      contact.created_at = undefined;
      contact.updated_at = undefined;
      res.json(jsonHelper(
          statusCodes.OK,
          "Contact fetched successfully",
          contact
      ))
  }catch(err){
      next(err)
  }
};

exports.sortByAttribute = async (req,res,next)=>{
  try{
      const attribute = req.body.attribute;
      const order = req.body.order;
      if(!req.user){
          const error = new Error("User Not Found");
          error.error = "User Null";
          error.statusCode = statusCodes.NO_CONTENT;
          throw error;
      }
      const sortedList = await  Contact.findAll({
          order: [
              [attribute, order]
          ]
      });
      res.json(jsonHelper(
          statusCodes.OK,
          "Sorted list fetched successfully",
          sortedList
      ))
  }  catch (err) {
      next(err)
  }
};

exports.searchByAttribute = async (req,res,next)=>{
  try{
      const attribute = req.query.attr;
      const value = req.query.value;
      if(!req.user){
          const error = new Error("User Not Found");
          error.error = "User Null";
          error.statusCode = statusCodes.NO_CONTENT;
          throw error;
      }
      if(attribute && value){
          const records = await  Contact.findAll({
              where:{
                  [attribute]:{[Op.like]: '%'+value+'%'}
              }
          });
          res.json(jsonHelper(
              statusCodes.OK,
              "Search results fetched successfully",
              records
          ))
      }else{
          const error = new Error("Null query parameters");
          error.error = "Null query parameters";
          error.statusCode = statusCodes.BAD_REQUEST;
          throw error;
      }
  }catch(err){
      next(err)
  }
};


exports.getHeaderData = async (req,res,next)=>{
  try{
      if(!req.user){
          const error = new Error("User Not Found");
          error.error = "User Null";
          error.statusCode = statusCodes.NO_CONTENT;
          throw error;
      }
      let headerData = [
          {
              name: "first_name",
              label: "First Name",
              required: true
          },{
              name: "middle_name",
              label: "Middle Name",
              required: false
          },{
              name: "last_name",
              label: "Last Name",
              required: true
          },{
              name: "email",
              label: "Email",
              required: false
          },{
              name: "mobile",
              label: "Mobile",
              required: false
          },{
              name: "landline",
              label: "Landline",
              required: false
          },{
              name: "notes",
              label: "Notes",
              required: false
          },{
              name: "created_at",
              label: "Created Date",
              required: false
          },
      ];
      res.json(jsonHelper(
          statusCodes.OK,
          "Metadata fetched successfully",
          headerData
      ))
  } catch(err){
      next(err)
  }
};