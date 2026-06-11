module.exports = function paginate(req, res, next) {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20; // default 20 items per page
  req.pagination = {
    limit,
    offset: (page - 1) * limit,
    page,
  };
  next();
};
