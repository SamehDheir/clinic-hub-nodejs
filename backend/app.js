const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const authRoutes = require("./routes/authRoutes");
const clinicRoutes = require("./routes/clinicRoutes");
const clinicUserRoutes = require("./routes/clinicUserRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const paymentRoute = require("./routes/paymentRoute");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Logging (only in development)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/api/clinic-users", clinicUserRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/payment", paymentRoute);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route Not Found" });
});

// 🛡️ Error Handler Middleware
app.use(errorHandler);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
