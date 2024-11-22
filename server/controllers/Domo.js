const { Types } = require('mongoose');

const { ObjectId } = Types;
const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => res.render('app');

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    food: req.body.food,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    console.log(newDomo);
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, food: newDomo.food });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making the domo!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age food').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

// delete domos
const deleteDomo = async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  try {
    const deleted = await Domo.deleteOne({ _id: id });

    if (deleted.deletedCount === 0) {
      return res.status(404).json({ error: 'No domo found!' });
    }

    return res.status(200).json({ message: 'Domo successfully deleted!' });
  } catch (err) {
    return res.status(500).json({ error: 'An error occured deleting the domo!' });
  }
};

// exports
module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
