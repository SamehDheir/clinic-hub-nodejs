function tenantMiddleware(req, res, next) {
  const clinicId = req.headers["x-clinic-id"];

  if (!clinicId) {
    return res
      .status(400)
      .json({ message: "Clinic ID (x-clinic-id) header is required" });
  }

  req.clinicId = clinicId;
  next();
}

module.exports = tenantMiddleware;
