const { endpointWrapper } = require("../utils");
const { selectUsers } = require("./model");

exports.getUsers = endpointWrapper(async (req, res) => {
  const users = await selectUsers();
  res.status(200).send({ users });
});
