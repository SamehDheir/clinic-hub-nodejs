const express = require("express");
const router = express.Router();

const {
  createMedicalRecord,
  getMedicalRecordByPatient,
  addVisit,
  getPatientVisits,
} = require("../controllers/medicalRecordController");

const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

router.post("/", protect, allowRoles("admin", "doctor"), createMedicalRecord);
router.get("/:patientId", protect, getMedicalRecordByPatient);
router.post("/:recordId/visits", protect, allowRoles("doctor"), addVisit);
router.get(
  "/:patientId/visits",
  protect,
  allowRoles("doctor", "admin"),
  getPatientVisits
);

module.exports = router;
