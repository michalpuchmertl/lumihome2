const express = require('express');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categories');

const debtsRouter = require('./debts');
const router = express.Router();

router.use('/:categoryId/debts', debtsRouter);

router.route('/').get(getCategories).post(createCategory);

router
  .route('/:id')
  .get(getCategory)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router;
