const { Router } = require("express");
const {
  create,
  get_all,
  set_default,
} = require("../../../controllers/role.ctrl");
const validate_request = require("../../../middlewares/validate_request");
const {
  create_validator,
  set_default_validator,
} = require("../../../schemas/role.sch");

const router = Router();

router.post("/", create_validator, validate_request, create);
router.get("/", get_all);
router.put(
  "/default/:id",
  set_default_validator,
  validate_request,
  set_default
);

module.exports = router;
