const express = require("express");
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");

const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

router.post(
  "/",
  protect,
  allowRoles("doctor", "receptionist"),
  createAppointment
);
router.get(
  "/",
  protect,
  allowRoles("admin", "doctor", "receptionist"),
  getAppointments
);
router.get("/:id", protect, allowRoles("admin", "doctor"), getAppointmentById);
router.put(
  "/:id",
  protect,
  allowRoles("admin", "receptionist"),
  updateAppointment
);
router.delete(
  "/:id",
  protect,
  allowRoles("admin", "receptionist"),
  deleteAppointment
);

module.exports = router;
