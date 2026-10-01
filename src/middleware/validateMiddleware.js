// src/middleware/validateMiddleware.js
// Validation middleware for request bodies and parameters.
// Ensures incoming client data is sanitized, non-empty, correctly formatted,
// and of correct types before reaching controllers or services.

// Helper to check if value is non-empty string
const isNonEmptyString = (val) => typeof val === "string" && val.trim().length > 0;

// Helper to check if value is a valid positive integer
const isPositiveInteger = (val) => {
  const num = Number(val);
  return Number.isInteger(num) && num > 0;
};

// Helper to validate email format
const isValidEmail = (email) => {
  if (typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

// Helper to validate date string format (YYYY-MM-DD or valid ISO date)
const isValidDate = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
};

/**
 * Middleware to validate URL :id parameter as positive integer
 */
const validateIdParam = (req, res, next) => {
  const { id } = req.params;
  if (!isPositiveInteger(id)) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: ["Parameter 'id' must be a valid positive integer."],
    });
  }
  next();
};

/**
 * Validation middleware for Project payload (POST / PUT)
 */
const validateProject = (isUpdate = false) => {
  return (req, res, next) => {
    const { Title, Faculty_ID, Start_Date, End_Date } = req.body;
    const errors = [];

    if (!isUpdate || Title !== undefined) {
      if (!isNonEmptyString(Title)) {
        errors.push("Title is required and must not be empty.");
      }
    }

    if (!isUpdate || Faculty_ID !== undefined) {
      if (!isPositiveInteger(Faculty_ID)) {
        errors.push("Faculty_ID is required and must be a valid positive integer.");
      }
    }

    if (Start_Date && !isValidDate(Start_Date)) {
      errors.push("Start_Date must be a valid date format (e.g. YYYY-MM-DD).");
    }

    if (End_Date && !isValidDate(End_Date)) {
      errors.push("End_Date must be a valid date format (e.g. YYYY-MM-DD).");
    }

    if (Start_Date && End_Date && isValidDate(Start_Date) && isValidDate(End_Date)) {
      if (new Date(End_Date) < new Date(Start_Date)) {
        errors.push("End_Date cannot be earlier than Start_Date.");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};

/**
 * Validation middleware for Team payload (POST / PUT)
 */
const validateTeam = (isUpdate = false) => {
  return (req, res, next) => {
    const { Project_ID, Team_Name } = req.body;
    const errors = [];

    if (!isUpdate || Project_ID !== undefined) {
      if (!isPositiveInteger(Project_ID)) {
        errors.push("Project_ID is required and must be a valid positive integer.");
      }
    }

    if (!isUpdate || Team_Name !== undefined) {
      if (!isNonEmptyString(Team_Name)) {
        errors.push("Team_Name is required and must not be empty.");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};

/**
 * Validation middleware for Student payload (POST / PUT)
 */
const validateStudent = (isUpdate = false) => {
  return (req, res, next) => {
    const { Team_ID, Name, Email, Phone, Password } = req.body;
    const errors = [];

    if (!isUpdate || Team_ID !== undefined) {
      if (!isPositiveInteger(Team_ID)) {
        errors.push("Team_ID is required and must be a valid positive integer.");
      }
    }

    if (!isUpdate || Name !== undefined) {
      if (!isNonEmptyString(Name)) {
        errors.push("Name is required and must not be empty.");
      }
    }

    if (!isUpdate || Email !== undefined) {
      if (!isValidEmail(Email)) {
        errors.push("Email is required and must be a valid email address.");
      }
    }

    if (!isUpdate || Password !== undefined) {
      if (typeof Password !== "string" || Password.length < 6) {
        errors.push("Password is required and must be at least 6 characters long.");
      }
    }

    if (Phone !== undefined && Phone !== null && Phone !== "") {
      if (typeof Phone !== "string" || Phone.trim().length < 7) {
        errors.push("Phone must be a valid string of at least 7 characters.");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};

/**
 * Validation middleware for Task payload (POST / PUT)
 */
const validateTask = (isUpdate = false) => {
  return (req, res, next) => {
    const { Project_ID, Student_ID, Task_Description, Start_Date, End_Date } = req.body;
    const errors = [];

    if (!isUpdate || Project_ID !== undefined) {
      if (!isPositiveInteger(Project_ID)) {
        errors.push("Project_ID is required and must be a valid positive integer.");
      }
    }

    if (Student_ID !== undefined && Student_ID !== null) {
      if (!isPositiveInteger(Student_ID)) {
        errors.push("Student_ID must be a valid positive integer when provided.");
      }
    }

    if (!isUpdate || Task_Description !== undefined) {
      if (!isNonEmptyString(Task_Description)) {
        errors.push("Task_Description is required and must not be empty.");
      }
    }

    if (Start_Date && !isValidDate(Start_Date)) {
      errors.push("Start_Date must be a valid date format.");
    }

    if (End_Date && !isValidDate(End_Date)) {
      errors.push("End_Date must be a valid date format.");
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};

/**
 * Validation middleware for Bug payload (POST / PUT)
 */
const validateBug = (isUpdate = false) => {
  return (req, res, next) => {
    const { Task_ID, Title, Description } = req.body;
    const errors = [];

    if (!isUpdate || Task_ID !== undefined) {
      if (!isPositiveInteger(Task_ID)) {
        errors.push("Task_ID is required and must be a valid positive integer.");
      }
    }

    if (!isUpdate || Title !== undefined) {
      if (!isNonEmptyString(Title)) {
        errors.push("Title is required and must not be empty.");
      }
    }

    if (!isUpdate || Description !== undefined) {
      if (!isNonEmptyString(Description)) {
        errors.push("Description is required and must not be empty.");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};

/**
 * Validation middleware for Comment payload (POST / PUT)
 */
const validateComment = (isUpdate = false) => {
  return (req, res, next) => {
    const { Student_ID, Bug_ID, Comment } = req.body;
    const errors = [];

    if (!isUpdate || Student_ID !== undefined) {
      if (!isPositiveInteger(Student_ID)) {
        errors.push("Student_ID is required and must be a valid positive integer.");
      }
    }

    if (!isUpdate || Bug_ID !== undefined) {
      if (!isPositiveInteger(Bug_ID)) {
        errors.push("Bug_ID is required and must be a valid positive integer.");
      }
    }

    if (!isUpdate || Comment !== undefined) {
      if (!isNonEmptyString(Comment)) {
        errors.push("Comment text is required and must not be empty.");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};

module.exports = {
  validateIdParam,
  validateProject,
  validateTeam,
  validateStudent,
  validateTask,
  validateBug,
  validateComment,
};
