const express = require('express');
const router = express.Router();

router.use("/v1", require("./routes/user"));
router.use("/v1", require("./routes/contact"));
router.use("/v1", require("./routes/contact-view"));

module.exports=router;