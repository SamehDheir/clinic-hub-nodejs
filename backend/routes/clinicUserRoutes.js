const express = require("express");
const router = express.Router();
const {
  getClinicUsers,
  addClinicUser,
  updateClinicUser,
  deleteClinicUser,
} = require("../controllers/clinicUserController");
const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

router.get("/", protect, allowRoles("admin"), getClinicUsers);
router.post("/", protect, allowRoles("admin"), addClinicUser);
router.delete("/:userId", protect, allowRoles("admin"), deleteClinicUser);

module.exports = router;
