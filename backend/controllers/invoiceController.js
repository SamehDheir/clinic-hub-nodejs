const Invoice = require("../models/invoiceModel");
const { validateCreateInvoice } = require("../validation/invoiceValidation");

// Create invoice
exports.createInvoice = async (req, res, next) => {
  try {
    const { error, value } = validateCreateInvoice(req.body);
    if (error) {
      const errors = error.details.map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { patientId, doctorId, items, paymentMethod } = value;
    const clinicId = req.user.clinicId;

    const totalAmount = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    const invoice = await Invoice.create({
      clinicId,
      patientId,
      doctorId,
      items: items.map((item) => ({
        ...item,
        total: item.unitPrice * item.quantity,
      })),
      totalAmount,
      paymentMethod,
    });

    res.status(201).json({ message: "Invoice created", invoice });
  } catch (err) {
    next(err);
  }
};

// Get invoices by clinic
exports.getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find({ clinicId: req.user.clinicId })
      .populate("patientId", "name")
      .populate("doctorId", "name");

    res.status(200).json({ message: "Invoices fetched", invoices });
  } catch (err) {
    next(err);
  }
};

// Mark as paid
exports.markInvoiceAsPaid = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId);

    if (
      !invoice ||
      invoice.clinicId.toString() !== req.user.clinicId.toString()
    ) {
      return res
        .status(404)
        .json({ message: "Invoice not found or access denied" });
    }

    invoice.status = "paid";
    await invoice.save();

    res.status(200).json({ message: "Invoice marked as paid", invoice });
  } catch (err) {
    next(err);
  }
};
