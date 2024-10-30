const express = require('express');
const router = express.Router();
const Finance = require('../Models/finance');
const mongoose = require('mongoose');


// Create New Invoice


  router.post('/invoice', async (req, res) => {
    console.log('Received data:', req.body); // Add this line

    try {
      const { projectId, amount, status,userId } = req.body;
      
      // Validate projectId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        console.log("66691f03b58339509e21afb8")
        return res.status(400).json({ error: 'Invalid project ID' });
      }
  
      const newInvoice = new Finance({
        projectId: new mongoose.Types.ObjectId(projectId),
        userId,
        amount,
        status
      });
  
      await newInvoice.save();
      res.status(201).json(newInvoice);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  });
// Show Project Invoices
router.get('/project/:projectId', async (req, res) => {
  try {
    const invoices = await Finance.find({ projectId: req.params.projectId });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/pay/:id', async (req, res) => {
  try {
    const financeId = req.params.id;
    const updatedFinance = await Finance.findByIdAndUpdate(
      financeId, 
      { status: 'paid' }, 
      { new: true }
    );

    if (!updatedFinance) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(updatedFinance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  


  router.get('/summary', async (req, res) => {
    try {
      const summary = await Finance.aggregate([
        {
          $group: {
            _id: null, // This will aggregate over all documents
            totalAmount: { $sum: '$amount' },
            totalPaid: {
              $sum: {
                $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0],
              },
            },
            totalUnpaid: {
              $sum: {
                $cond: [{ $eq: ['$status', 'unpaid'] }, '$amount', 0],
              },
            },
          },
        },
      ]);
  
      res.json(summary[0] || { totalAmount: 0, totalPaid: 0, totalUnpaid: 0 });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  


// Get all unpaid invoices
router.get('/unpaid', async (req, res) => {
    try {
    const unpaidInvoices = await Finance.find({ status: 'unpaid' })
      .populate({
        path: 'userId',
        select: 'firstname lastname' 
      })
      .populate('projectId', 'name');

    const formattedInvoices = unpaidInvoices.map(invoice => ({
      _id: invoice._id,
      amount: invoice.amount,
      status: invoice.status,
      date: invoice.date,
      projectId: invoice.projectId,
      projectName: invoice.projectId ? invoice.projectId.name : null,
      user: invoice.userId ? {
        firstName: invoice.userId.firstname,
        lastName: invoice.userId.lastname
      } : null
    }));

    res.json(formattedInvoices);

    } catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/paid', async (req, res) => {
    try {
      const paidInvoices = await Finance.find({ status: 'paid' })
        .populate({
          path: 'userId',
          select: 'firstname lastname' // Select only the firstname and lastname fields from User
        })
        .populate('projectId', 'name'); // Optionally populate the project name if needed
  
      console.log('Paid invoices from DB:', paidInvoices);
  
      const formattedInvoices = paidInvoices.map(invoice => ({
        _id: invoice._id,
        totalAmount: invoice.amount,
        status: invoice.status,
        date: invoice.date,
        projectId: invoice.projectId,
        projectName: invoice.projectId ? invoice.projectId.name : null,
        user: invoice.userId ? {
          firstName: invoice.userId.firstname,
          lastName: invoice.userId.lastname
        } : null
      }));
  
      console.log('Formatted paid invoices:', formattedInvoices);
  
      res.json(formattedInvoices);
    } catch (error) {
      console.log('Error fetching paid invoices:', error);
      res.status(500).json({ error: error.message });
    }
  });


module.exports = router;
