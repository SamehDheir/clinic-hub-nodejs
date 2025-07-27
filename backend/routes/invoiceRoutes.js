const express = require("express");
const router = express.Router();
const {
  createInvoice,
  getInvoices,
  markInvoiceAsPaid,
} = require("../controllers/invoiceController");

const { protect } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

router.post("/", protect, allowRoles("admin", "doctor"), createInvoice);
router.get("/", protect, allowRoles("admin", "doctor"), getInvoices);
router.put("/:invoiceId/pay", protect, allowRoles("admin"), markInvoiceAsPaid);

module.exports = router;
