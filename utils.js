exports.endpointWrapper = (endpoint) => async (req, res, next) => {
  try {
    endpoint(req, res, next);
  } catch (err) {
    next(err);
  }
};
