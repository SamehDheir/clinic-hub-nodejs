const express = require("express");
const router = express.Router();
const {
  createClinic,
  getAllClinics,
  getClinicById,
  updateClinic,
  deleteClinic,
  getClinicUsers,
} = require("../controllers/clinicController");

const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

router.post("/", protect, allowRoles("admin","doctor"), createClinic);
router.get("/", protect, allowRoles("admin"), getAllClinics); 
router.get("/:id", protect, getClinicById); 
router.put("/:id", protect, updateClinic); 
router.delete("/:id", protect, deleteClinic); 

module.exports = router;
