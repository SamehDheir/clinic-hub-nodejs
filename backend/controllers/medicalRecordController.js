const MedicalRecord = require("../models/medicalRecordModel");
const { validateCreateMedicalRecord, validateAddVisit } = require("../validation/medicalRecordValidation");

// Create New Mediacl Record
exports.createMedicalRecord = async (req, res, next) => {
  try {
    const { error, value } = validateCreateMedicalRecord(req.body);
    if (error) {
      const errors = error.details.map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const existingRecord = await MedicalRecord.findOne({
      patientId: value.patientId,
    });
    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Medical record for this patient already exists" });
    }

    const newRecord = await MedicalRecord.create({
      ...value,
      allergies: value.allergies || [],
      chronicDiseases: value.chronicDiseases || [],
    });

    res.status(201).json({
      message: "Medical record created successfully",
      record: newRecord,
    });
  } catch (error) {
    next(error);
  }
};

// Get Mediacl Record To Paitent
exports.getMedicalRecordByPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const record = await MedicalRecord.findOne({ patientId })
      .populate("patientId", "name email")
      .populate("visits.doctorId", "name");

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    res.status(200).json({ record });
  } catch (error) {
    next(error);
  }
};

// Add visit to medical recorde
exports.addVisit = async (req, res, next) => {
  try {
    const { error, value } = validateAddVisit(req.body);
    if (error) {
      const errors = error.details.map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const { recordId } = req.params;

    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Only doctors can add visits" });
    }

    const medicalRecord = await MedicalRecord.findById(recordId);
    if (!medicalRecord) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    const newVisit = {
      doctorId: req.user.id,
      department: value.department,
      notes: value.notes,
      diagnosis: value.diagnosis,
      prescription: value.prescription,
      date: new Date(),
    };

    medicalRecord.visits.push(newVisit);
    await medicalRecord.save();

    res.status(201).json({
      message: "Visit added successfully",
      visit: newVisit,
    });
  } catch (err) {
    next(err);
  }
};

// Get patient visits
exports.getPatientVisits = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const record = await MedicalRecord.findOne({ patientId })
      .populate("visits.doctorId", "name email role")
      .select("visits clinicId")
      .exec();

    if (!record) {
      return res.status(404).json({ message: "Medical record not found" });
    }

    if (
      !req.user.clinicId ||
      !record.clinicId ||
      req.user.clinicId.toString() !== record.clinicId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Access denied: not your clinic" });
    }

    res.status(200).json({
      message: "Patient visits fetched successfully",
      visits: record.visits,
    });
  } catch (err) {
    next(err);
  }
};
  