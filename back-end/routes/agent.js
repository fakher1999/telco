const express = require('express');
const router = express.Router();
const Agent = require('../Models/agent');
const Permission = require('../Models/permission');
const nodemailer = require('nodemailer');

// Create Agent
router.post('/create', async (req, res) => {
  try {
    const agent = new Agent({
        'email': req.body.email,
        'password': req.body.password,
    });
    const savedAgent = await agent.save();
    const newAgent = await Agent.findById(savedAgent.id);

    req.body.permissions.forEach( p => {
        newAgent.permissions.push(p);
        
    });
    await newAgent.save();


        // Create a SMTP transporter without authentication
        const transporter = nodemailer.createTransport({
            host: 'smtp.freesmtpservers.com',
            port: 25,
            secure: false // false for TLS - as per your provided details
        });

        // Setup email data
        const mailOptions = {
            from: 'admn@gmail.com',
            to: req.body.email,
            subject: 'Access Email',
            text: `This is a test email account : ${req.body.email} , password : ${ req.body.password}.`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error occurred:', error.message);
                return;
            }
            console.log('Email sent successfully!');
            console.log('Message ID:', info.messageId);
        });

    res.status(201).send(agent);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get Agent by ID
router.get('/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).populate('permissions');
    if (!agent) {
      return res.status(404).send();
    }
    res.send(agent);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.get('/' , (req,res)=>{
  Agent.find({})
  .then(
      (agents)=>{
          res.status(200).send(agents);
      }
  )
  .catch(
      (err)=>{
          res.status(400).send(err);
      }
  )
});

// Update Agent by ID
router.patch('/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['email', 'password', 'permissions']; // Add any other allowed fields
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      return res.status(404).send();
    }
    updates.forEach(update => agent[update] = req.body[update]);
    await agent.save();
    res.send(agent);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete Agent by ID
router.delete('/:id', async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);
    if (!agent) {
      return res.status(404).send();
    }
    res.send(agent);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Assign Permission to Agent
router.post('/:agentId/permissions/:permissionId', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.agentId);
    const permission = await Permission.findById(req.params.permissionId);

    if (!agent || !permission) {
      return res.status(404).send();
    }

    agent.permissions.push(permission._id);
    await agent.save();

    res.send(agent);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
