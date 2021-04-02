const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();

  if (!categories) {
    return next(new ErrorResponse(`Categories are empty`, 404));
  }

  console.log(categories);

  res
    .status(200)
    .json({ success: true, count: categories.length, data: categories });
});

// @desc    Get category by id
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category id ${req.params.id} not found.`, 404)
    );
  }
  res.status(200).json({ success: true, data: category });
});

// @desc    Create category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(201).json({ success: true, data: category });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category id ${req.params.id} not found`, 404)
    );
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: category });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(
      new ErrorResponse(`Category id ${req.params.id} not found`, 404)
    );
  }

  await category.remove();

  res.status(200).json({ success: true, data: {} });
});
