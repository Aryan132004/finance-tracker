// Centralized error handler - catches errors passed via next(err)
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  // Duplicate key (e.g., unique category name)
  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate entry" });
  }

  // Default server error
  res.status(500).json({ message: err.message || "Internal server error" });
};

module.exports = { errorHandler };
