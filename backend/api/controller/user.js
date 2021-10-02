const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const Contact = require("../../models/contact");
const statusCodes = require('../../util/status-codes');
const jsonHelper = require('../../util/json-helper');
const utils = require("../../util/helper-functions");

exports.userLogin = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        if (!username) {
            const error = new Error("username not found");
            error.error = "Invalid Parameters";
            error.statusCode = statusCodes.BAD_REQUEST;
            throw error;
        }
        let user = await User.findOne({
            raw: true,
            where:{name: username === ("" || null || undefined) ? "NAN" : username},
            attributes: {
                exclude: ['created_at', 'updated_at']
            }
        });
        if (user == null) {
            if(username === "Test User"){
                const hashedPw = await bcrypt.hash(password, 12);
                user = await User.create({
                    name: username,
                    password: hashedPw,
                    created_at: utils.getIstTimeStampUnix(),
                    updated_at: utils.getIstTimeStampUnix()
                })
            }else{
                const error = new Error("User Not Found");
                error.error = "Invalid User";
                error.statusCode = statusCodes.NO_CONTENT;
                throw error;
            }
        }
        if (password && !await bcrypt.compare(password, user.password)) {
            const error = new Error("Password did not match");
            error.error = "Invalid Password";
            error.statusCode = statusCodes.NO_CONTENT;
            throw error;
        }
        const token = jwt.sign({
                userId: user.id
            },
            process.env.TOKEN_GENERATION_KEY
        );

        delete user.password;

        const data = {
            user: user,
            token: token
        };
        res.json(jsonHelper(
            statusCodes.OK,
            "User Logged In Successfully",
            data
        ));
    } catch (err) {
        next(err);
    }
};


exports.listUserContacts = async (req,res,next) => {
  try{
      const user = req.user;
      const userId = req.params.userId;
      if(!user){
          const error = new Error("User Not Found");
          error.error = "User Null";
          error.statusCode = statusCodes.NO_CONTENT;
          throw error;
      }
      const contacts = await Contact.findAll({
          where:{
              userId: userId
          }
      });
      res.json(jsonHelper(
          statusCodes.OK,
          "Contacts fetched successfully",
           contacts
      ))
  } catch (err) {
      next(err);
  }
};