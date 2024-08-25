const knex = require("knex")(require("../knexfile").development);

// Get all users
const getUsers = async (req, res) => {
  const { N_ID } = req.query;
  console.log(N_ID)
  console.log("inside controller");
  try {
    const users = await knex('Users').select('N_Id', 'name').where('N_Id', N_ID)
      .first();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUsers
};
