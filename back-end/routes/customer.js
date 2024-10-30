const express = require('express');
const router = express.Router();
const Customer = require('../Models/customer');

// CREATE a new customer
router.post('/', async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    zone: req.body.zone,
    age: req.body.age,
    sex: req.body.sex,
    telephone: req.body.telephone
  });

  try {
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a customer by ID
router.get('/:id', getCustomer, (req, res) => {
  res.json(res.customer);
});

// UPDATE a customer
router.put('/:id', getCustomer, async (req, res) => {
  if (req.body.name != null) {
    res.customer.name = req.body.name;
  }
  if (req.body.zone != null) {
    res.customer.zone = req.body.zone;
  }
  if (req.body.geography != null) {
    res.customer.geography = req.body.geography;
  }
  if (req.body.age != null) {
    res.customer.age = req.body.age;
  }
  if (req.body.sex != null) {
    res.customer.sex = req.body.sex;
  }
  if (req.body.telephone != null) {
    res.customer.telephone = req.body.telephone;
  }

  try {
    const updatedCustomer = await res.customer.save();
    res.json(updatedCustomer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a customer
router.delete('/:id', getCustomer, async (req, res) => {
  try {
    await res.customer.remove();
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get customer by ID
async function getCustomer(req, res, next) {
  let customer;
  try {
    customer = await Customer.findById(req.params.id);
    if (customer == null) {
      return res.status(404).json({ message: 'Customer not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.customer = customer;
  next();
}

module.exports = router;
