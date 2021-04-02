const Debt = require('../models/Debt');

const debtsResults = (userSide) => async (req, res, next) => {
  let query;

  let oppUserSide = userSide === 'creditor' ? 'debtor' : 'creditor';

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // Loop over removeFields and delete them from request query
  removeFields.forEach((param) => {
    delete reqQuery[param];
  });

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, ...)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resource
  query = Debt.find(JSON.parse(queryStr));

  query = query.where(`users.${userSide}`).equals(req.user.id);

  query = query.select(`-users.${userSide}`);

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const total = await Debt.countDocuments();

  query = query.populate(`users.${oppUserSide} category`);

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const results = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  // Add final amount to results
  let sum = 0;
  if (results.length) {
    sum = results.sum = results
      .map((debt) => debt.amount - debt.amountPaid)
      .reduce((accumulator, currentValue) => accumulator + currentValue);
  }

  res.debtsResults = {
    success: true,
    count: results.length,
    pagination,
    sum,
    data: results,
  };

  next();
};

module.exports = debtsResults;
