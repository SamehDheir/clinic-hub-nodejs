const Payment = require("../models/paymentModel");
const Invoice = require("../models/invoiceModel");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment
exports.createPayment = async (req, res, next) => {
  try {
    const { invoiceId, amountPaid, paymentMethod } = req.body;
    const clinicId = req.user.clinicId;

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice || invoice.clinicId.toString() !== clinicId.toString()) {
      return res
        .status(404)
        .json({ message: "Invoice not found in your clinic" });
    }

    const payment = await Payment.create({
      invoiceId,
      amountPaid,
      paymentMethod,
      clinicId,
    });

    res.status(201).json({ message: "Payment recorded successfully", payment });
  } catch (err) {
    next(err);
  }
};

//
exports.createStripeCheckoutSession = async (req, res, next) => {
  try {
    const { invoiceId, amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Invoice #${invoiceId}`,
            },
            unit_amount: amount * 100, // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        invoiceId,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

// Get payment
exports.getPayments = async (req, res, next) => {
  try {
    const clinicId = req.user.clinicId;
    const payments = await Payment.find({ clinicId }).populate("invoiceId");
    res.status(200).json({ payments });
  } catch (err) {
    next(err);
  }
};

//
