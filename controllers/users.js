const { User } = require("../models/users");

exports.getAll = asyncHandler(async (req, res) => {
  const allUsers = await User.find();
  res.status(200).send(allUsers);
});