const clerk = require('@clerk/clerk-sdk-node');

const getUser = async (req, res) => {
  const userId = 'user_2QcP6NqJunjkXoKnJ3Zv99i7dMJ';
  try {
    const user = await clerk.users.getUser(userId);
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await clerk.users.getUserList();
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    console.log(error);

    res.status(500).json(error);
  }
};

module.exports = { getUser, getAllUsers };
