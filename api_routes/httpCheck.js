var express = require("express");
var router = express.Router();
var httpCheck = require("../services/httpCheckService");

router.post("/", httpCheck.createNewCheck);
router.get("/:id", httpCheck.getHttpCheck);
router.delete("/:id", httpCheck.deleteHttpCheck);
router.put("/:id", httpCheck.updateHttpCheck);
router.get("/", httpCheck.getAllHttpCheck);

module.exports = router;
