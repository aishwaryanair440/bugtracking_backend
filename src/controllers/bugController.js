// src/controllers/bugController.js
// Handles HTTP requests for bug reports.

const bugService = require("../services/bugService");

const getBugs = async (req, res, next) => {
  try {
    const bugs = await bugService.getAllBugs();
    res.status(200).json({
      success: true,
      message: "Bugs retrieved successfully",
      data: bugs,
    });
  } catch (error) {
    next(error);
  }
};

const getBugById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bug = await bugService.getBugById(id);

    if (!bug) {
      return res.status(404).json({
        success: false,
        message: "Bug report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bug report retrieved successfully",
      data: bug,
    });
  } catch (error) {
    next(error);
  }
};

const createBug = async (req, res, next) => {
  try {
    const newBug = await bugService.createBug(req.body);
    res.status(201).json({
      success: true,
      message: "Bug report created successfully",
      data: newBug,
    });
  } catch (error) {
    next(error);
  }
};

const updateBug = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBug = await bugService.updateBug(id, req.body);

    if (!updatedBug) {
      return res.status(404).json({
        success: false,
        message: "Bug report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bug report updated successfully",
      data: updatedBug,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBug = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await bugService.deleteBug(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Bug report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bug report deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
};
