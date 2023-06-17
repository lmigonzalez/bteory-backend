const adminModel = require('../models/adminModel');
const clerk = require('@clerk/clerk-sdk-node');

const createNewAdmin = async (req, res) => {
  const { email, level } = req.body;

  try {
    const users = await clerk.users.getUserList();

    const foundUser = users.find(
      (user) => user.emailAddresses[0].emailAddress === email
    );

    if (!foundUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newAdmin = {
      email,
      level,
      userId: foundUser.id,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
    };

    const response = await adminModel.create(newAdmin);

    res.status(201).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find({});

    res.status(200).json(admins);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteAdmin = async (req, res) => {
  const { _id } = req.params;
  console.log(_id);

  try {
    const admin = await adminModel.findByIdAndDelete(_id);
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json(err);
  }
};

const patchAdmin = async (req, res) => {
  const { _id } = req.params;
  const level = req.body.level;

  console.log(req.body);

  try {
    const admin = await adminModel.findByIdAndUpdate(_id, { level });
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { createNewAdmin, getAdmins, deleteAdmin, patchAdmin };
