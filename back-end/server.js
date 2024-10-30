const express = require('express');
const jwt = require('jsonwebtoken'); 
const userApi = require('./routes/user');
const taskApi = require('./routes/task');
const financeApi = require('./routes/finance');
const roleApi = require('./routes/role');
const permissionApi = require('./routes/permission');
const agentApi = require('./routes/agent');
const customerApi = require('./routes/customer');
const quizApi = require('./routes/quiz');
const rapportApi = require('./routes/rapport');
const dashboardAPI = require('./routes/dashboard');

const cors = require('cors');
require('./config/connect');

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static('uploads'));


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("authHeader" , authHeader)
    let token = null;
    if(!authHeader) return toekn
    token = authHeader && authHeader.split(' ')[1]; // Extract Bearer token
  
    if (!token) {
      return res.status(401).json({ message: 'Access token is missing' }); // No token found
    }
  
    // Verify token
    jwt.verify(token, '123456789', (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
  
      // If valid, inject user ID from token into req.body
      console.log("user",user)
      req.body.userId = user._id;
      req.body.user = user;
      next(); // Move to the next middleware or route handler
    });
};

app.use('/author' , userApi);
app.use('/task' , authenticateToken,taskApi);
app.use('/finance' , financeApi);
app.use('/role' , roleApi);
app.use('/permission' , permissionApi);
app.use('/agents' , agentApi);
app.use('/customer' , customerApi);
app.use('/quizzes', authenticateToken ,quizApi);
app.use('/rapports', authenticateToken ,rapportApi);
app.use('/dashboard-analytics', authenticateToken ,dashboardAPI);

app.use('/getimage' , express.static('./uploads'));


app.listen(3000, ()=>{
    console.log('server works');
})