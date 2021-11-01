exports.endpointWrapper = (endpoint) => async (req, res, next) => {
  try {
    await endpoint(req, res, next);
  } catch (err) {
    next(err);
  }
};
