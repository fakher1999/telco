const express = require('express');

const router = express.Router();


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Task = require('../Models/task');
const User = require('../Models/user')
const Customer = require('../Models/customer.js');
const Agent = require('../Models/agent.js');
const Tag = require('../Models/tag.js');
const Quiz = require('../Models/quiz');


async function getUnusedTasks() {
    try {
      const unusedTasks = await Task.aggregate([
        {
          $lookup: {
            from: 'finances', 
            localField: '_id',
            foreignField: 'projectId',
            as: 'financeDocuments'
          }
        },
        {
          $match: {
            financeDocuments: { $size: 0 }
          }
        },
        {
          $project: {
            financeDocuments: 0
          }
        }
      ]);
  
      return unusedTasks;
    } catch (error) {
      console.error('Error fetching unused tasks:', error);
      throw error;
    }
  }

  
__filename = '';
const mystorage = multer.diskStorage({

    destination: './uploads',
    filename: (req , file ,cb)=>{
        let date = Date.now(); 

        let fl = date + '.' + file.mimetype.split('/')[1];
        cb(null , fl);
        __filename = fl;
    }
})
 
const upload = multer({storage: mystorage});

router.post('/save' ,upload.fields([{ name: 'photo' }]) ,async (req,res)=>{
     
    let data = req.body;
    const { tags, ...taskData } = req.body;
    console.log(tags);
    console.log(taskData);
    let task = new Task(data)

    

    task.save()
        .then(
           async  (savedtask)=>{
                __filename = '';
                 // Handle tags if they exist
                if (tags && Array.isArray(tags)) {
                  await Promise.all(tags.map(async (tagName) => {
                    try {
                      // Normalize tag name
                      const normalizedTag = tagName.trim().toLowerCase();
                      
                      // Skip empty tags
                      if (!normalizedTag) return;
                      
                      // Use findOneAndUpdate with proper options
                      await Tag.findOneAndUpdate(
                        { name: normalizedTag },
                        { $inc: { count: 1 } },
                        { 
                          upsert: true,
                          new: true,
                          runValidators: true 
                        }
                      );
                    } catch (tagError) {
                      console.error('Error processing tag:', tagError);
                      // Continue with other tags even if one fails
                    }
                  }));
                }
                res.status(200).send(savedtask);
            }
        )
        .catch(
            (err)=>{
                console.error(err);
                res.status(400).send(err);
            }
        )





    
})


// Get all tags
router.get('/tags', async (req, res) => {
  try {
    // Fetch all questions
    const quizzes = await Quiz.find();
    const allQuestions = quizzes.flatMap(quiz => 
      quiz.questions.map(question => question.questionText)
    );
  
    // Define the regular expression pattern
    const regex = /Do you have (.+?)\?/g;  // Adjusted regex to capture text without quotes
  
    // Array to store the extracted texts
    const extractedTexts = [];
    console.log("allQuestions", allQuestions);
  
    // Loop through each question
    allQuestions.forEach((question) => {
      const matches = [...question.matchAll(regex)];
      console.log("Matches for question:", question, matches);
      
      // Extract and store each match
      matches.forEach((match) => {
        extractedTexts.push(match[1].trim()); // match[1] contains the captured text
      });
    });
  
    console.log('Extracted Texts:', extractedTexts);
  
    res.json(extractedTexts);
  
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/unused-tasks', async (req, res) => {
    try {
      const unusedTasks = await getUnusedTasks();
      res.json(unusedTasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching unused tasks', error: error.message });
    }
  });
  


router.get('/all' , (req,res)=>{
    Task.find({})
    .then(
        (tasks)=>{
            res.status(200).send(tasks);
        }
    )
    .catch(
        (err)=>{
            res.status(400).send(err);
        }
    )
})

router.get('/getbyid/:id' , (req,res)=>{
    let id = req.params.id;
    target: req.body.target

    Task.findOne({_id : id})
    .then(
        (task)=>{
            res.status(200).send(task);
        }
    )
    .catch(
        (err)=>{
            res.status(400).send(err);
        }
    )
})

router.delete('/:id' , (req,res)=>{

    let id = req.params.id;

    Task.findByIdAndDelete({_id : id})
        .then(
            (task)=>{
                res.status(200).send(task);
            }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
})

// upload.fields([{ name: 'photo' }]),
router.put('/update/:id',  (req, res) => {
  let taskId = req.params.id;
  let updatedData = req.body;

  Task.findById(taskId)
      .then(task => {
          if (!task) {
              return res.status(404).send({ message: "Task not found" });
          }

          // Iterate over each key in updatedData and update if value is not null or undefined
          for (const key in updatedData) {
              if (updatedData.hasOwnProperty(key) && updatedData[key] !== null && updatedData[key] !== undefined) {
                  task[key] = updatedData[key];
              }
          }

          // // Handle file upload for photo, if provided
          // if (req.files['photo']) {
          //     task.photo = req.files['photo'][0].path;
          // }

          return task.save();
      })
      .then(updatedTask => {
          res.status(200).send(updatedTask);
      })
      .catch(err => {
          res.status(400).send(err);
      });
});



router.put('/confime/:id', async (req, res) => {

  try {
  let taskId = req.params.id;
  const { password, userId } = req.body;
    // Verify password
    const user = await User.findById(userId);
    const agent = await Agent.findById(userId);

    console.log('agent' ,agent)
    if(!agent || agent.password != password) {
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid password' });
      }
    }


    const task =  await Task.findById(taskId)
    task.confirmed = true;

    await task.save();


    res.status(201).json(task);

  } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.post('/calculate-price/' ,async (req,res)=>{

        const { sex, zone, minAge, maxAge } = req.body;

        // Build search criteria dynamically
        let searchCriteria = {};
      
        if (sex) {
          searchCriteria.sex = sex;
        }
      
        if (zone) {
          searchCriteria.zone = zone;
        }
      
        if (minAge && maxAge) {
          searchCriteria.age = { $gte: parseInt(minAge), $lte: parseInt(maxAge) };
        } else if (minAge) {
          searchCriteria.age = { $gte: parseInt(minAge) };
        } else if (maxAge) {
          searchCriteria.age = { $lte: parseInt(maxAge) };
        }
      
        try {
          const customers = await Customer.find(searchCriteria);
          console.log(customers.length)
          res.json({  
            numberOfEligibleUsers : customers.length, 
            totalPrice: customers.length*20
        });
        } catch (err) {
            console.error(err)
            res.status(200).json({  
                numberOfEligibleUsers : 0, 
                totalPrice: 0
            });
        }
})

module.exports = router ;