import express from "express"; 
import verifyUser from "../controller/verifyUser.js";
import signatureRequired from "../middleware/signatureRequired.js";
import handelMessages from "../controller/handelMessages.js";

const router = express.Router();
router.get('/', verifyUser);
router.post('/',signatureRequired, handelMessages);

export default router;