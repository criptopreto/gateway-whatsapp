const { Router } = require("express");
const {
  change_password,
  verify_email_send_token,
  validate_email_token,
  validate_phone_send_token,
  validate_phone_otpsms,
} = require("../../../controllers/validate.ctrl");

const router = Router();

router.post("/token", validate_email_token);
router.post("/password", change_password);
router.post("/otpemail", verify_email_send_token);
router.post("/otpsms", validate_phone_send_token);
router.post("/verify/otpsms", validate_phone_otpsms);

module.exports = router;
