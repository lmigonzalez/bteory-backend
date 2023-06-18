const adminModel = require('../models/adminModel');
const clerk = require('@clerk/clerk-sdk-node');

const userExists = async (req, res, next) => {
  const userId = req.headers.authorization.split(' ')[1];

  // const userId = 'user_2QcP6NqJunjkXoKnJ3Zv99i7dMJ';

  try {
    // const user = await adminModel.findById(userId);
    const user = await clerk.users.getUser(userId);
    console.log(user);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const isAdmin = async (req, res, next) => {
  const userId = req.headers.authorization.split(' ')[1];

  try {
    const user = await adminModel.findById(userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const userAdmin = async (req, res, next) => {
  const userId = req.headers.authorization.split(' ')[1];

  try {
    const user = await adminModel.findById(userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (user.level !== 'users') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const questionsAdmin = async (req, res, next) => {
  const userId = req.headers.authorization.split(' ')[1];

  try {
    const user = await adminModel.findById(userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (user.level !== 'questions') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const bothAdmin = async (req, res, next) => {
  const userId = req.headers.authorization.split(' ')[1];

  try {
    const user = await adminModel.findById(userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (user.level !== 'both') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const superAdmin = async (req, res, next) => {
  const userId = req.headers.authorization.split(' ')[1];

  try {
    const user = await adminModel.findById(userId);

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (user.level !== 'top') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = {
  userExists,
  isAdmin,
  userAdmin,
  questionsAdmin,
  bothAdmin,
  superAdmin,
};
