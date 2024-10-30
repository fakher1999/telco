


const express = require('express');

const router = express.Router();

const User = require('../Models/user');
const Agent = require('../Models/agent');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const permission = require('../Models/permission');

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

router.post('/register' , upload.fields([{ name: 'logo' }, { name: 'rne' }, { name: 'patente' }]) , (req,res)=>{
     
    let data = req.body;
    let user = new User(data)

    user.banned_date = new Date('3000-01-01').getTime();
    user.activate_date = new Date('2000-01-01').getTime();

    console.log(user);

    salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(data.password , salt);

    user.save()
        .then(
            (savedUser)=>{
                __filename = '';
                res.status(200).send(savedUser);
            }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Log request data for debugging
        console.log("Login request body:", req.body);

        // Check User collection for the email
        let user = await User.findOne({ email });
        let agent = null;

        // If no user is found, check in the Agent collection
        if (!user) {
            agent = await Agent.findOne({ email });
            if (!agent) {

                return res.status(400).json({ message: 'Invalid email or password' });
            }
        }

        // If user exists, validate password for user
        if (user) {

            const isValidPassword = bcrypt.compareSync(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Generate JWT for User
            const payload = {
                _id: user._id,
                email: user.email,
                role: 'user' // Added role to distinguish user or agent
            };
            const token = jwt.sign(payload, '123456789', { expiresIn: '1h' });

            const isAdmin = user.email === "fvrbntrl@gmail.com";

            return res.status(200).json({
                token,
                permissions: user.permissions || ['66693007e9b2b5672be9fcbf', "671025d272d5a499ec1ddb65"],
                isAdmin,
                role: 'user'
            });

        }

        // If agent exists, validate password for agent
        if (agent) {
            const isValidPassword = password == agent.password;
            if (!isValidPassword) {

                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Generate JWT for Agent
            const payload = {
                _id: agent._id,
                email: agent.email,
                role: 'agent' // Added role to distinguish user or agent
            };
            const token = jwt.sign(payload, '123456789', { expiresIn: '1h' });

            return res.status(200).json({
                token,
                permissions: agent.permissions,
                isAdmin: false, // Agent is not admin in this case
                role: 'agent'
            });
        }
    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ message: 'An error occurred while logging in', error: err.message });
    }
});
router.get('/all' , (req,res)=>{
    User.find({})
    .then(
        (users)=>{
            res.status(200).send(users);
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

    User.findOne({_id : id})
    .then(
        (user)=>{
            res.status(200).send(user);
        }
    )
    .catch(
        (err)=>{
            res.status(400).send(err);
        }
    )
})

router.delete('/supprimer/:id' , (req,res)=>{

    let id = req.params.id;

    User.findByIdAndDelete({_id : id})
        .then(
            (user)=>{
                res.status(200).send(user);
            }
        )
        .catch(
            (err)=>{
                res.status(400).send(err);
            }
        )
})


router.get('/banned/:id' , (req,res)=>{

    let id = req.params.id;

    User.findOne({_id : id})
    .then(
        (user)=>{
            const now = new Date(); // Get the current date and time
            user.banned_date = now.getTime() + 10 * 24 * 60 * 60 * 1000;
            user.save();
            res.status(200).send(user);
        }
    )
    .catch(
        (err)=>{
            res.status(400).send(err);
        }
    )
})



router.get('/suspend/:id' , (req,res)=>{

    let id = req.params.id;

    User.findOne({_id : id})
    .then(
        (user)=>{
            const now = new Date("3000-01-01"); // Get the current date and time
            user.banned_date = now.getTime();
            user.save();
            res.status(200).send(user);
        }
    )
    .catch(
        (err)=>{
            res.status(400).send(err);
        }
    )
})


router.get('/activate/:id/:date' , (req,res)=>{

    let id = req.params.id;
    let date = req.params.date;

    User.findOne({_id : id})
    .then(
        (user)=>{
            const now = new Date(); // Get the current date and time
            user.banned_date = now.getTime();
            user.activate_date = date;
            user.save();
            res.status(200).send(user);
        }
    )
    .catch(
        (err)=>{
            res.status(400).send(err);
        }
    )
})




module.exports = router ;