const { endpointWrapper } = require("../utils");
const { selectTopics } = require("./model");

exports.getTopics = endpointWrapper(async (req, res) => {
  const topics = await selectTopics();
  res.status(200).send({ topics });
});
