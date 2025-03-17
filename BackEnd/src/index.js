const express = require('express');
const dotenv = require('dotenv');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); 

dotenv.config();
const app = express();
const prisma = new PrismaClient();

const corsOptions = {
  origin: '*', 
};

app.use(cors(corsOptions));

const { createClient } = require('@supabase/supabase-js');
const { chownSync } = require('fs');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

// JWT Middleware
const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(403).send('Access denied');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send('Access denied');
    }
    req.user = user;
    next();
  });
};


app.post('/register', async (req, res) => {
  let { email, password, role } = req.body; // role can be 'admin' or 'user'
  
  role = role.toLowerCase().trim()

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role, 
    },
  });

  const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  console.log(newUser)
  console.log(newUser.role)
  res.status(201).json({ token , userRole: newUser.role });
});



app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // If user does not exist or password does not match, return error
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send('Invalid credentials');
    }

    // Create JWT token with user's id, email, and role
    const token = jwt.sign(
      { id: user.id, email: user.email, userRole: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    console.log(user.id,  user.email, user.role )

    // Send the token in the response
    return res.json({ token, role: user.role });

  } catch (error) {
    // If any error occurs, send a 500 status with the error message
    console.error(error); // Log the error for debugging purposes
    return res.status(500).send('Something went wrong. Please try again later.');
  }
});


app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: 'USER',
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post('/prompts', authenticateJWT, async (req, res) => {
  const { title, description, assignedUser } = req.body; // You can also get assignedUser here
  try {
    const newPrompt = await prisma.prompt.create({
      data: {
        title,
        content: description, // 'content' should match your model
        createdBy: req.user.id, // Assuming req.user contains the authenticated user's ID
      },
    });

   
    if (assignedUser) {
      await prisma.assignedPrompt.create({
        data: {
          promptId: newPrompt.id,
          userId: assignedUser,
          deadline : new Date()
        },
      });
    }

    res.status(201).json(newPrompt); // Respond with the created prompt
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating prompt' });
  }
});


app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    const { originalname, mimetype, buffer } = req.file;
    const filePath = `${Date.now()}_${originalname}`; // Path in the bucket

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('uploads') // 'uploads' is your bucket name
      .upload(filePath, buffer, {
        contentType: mimetype,
        upsert: true, // If the file already exists, overwrite it
      });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Return file info (URL to access the file)
    const fileUrl = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath).publicURL;

    res.status(200).json({ file: data, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/prompts/:promptId/submit', authenticateJWT, upload.single('file'), async (req, res) => {
  try {
    const { promptId } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Ensure file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload file to Supabase Storage
    const { originalname, mimetype, buffer } = req.file;
    const filePath = `submissions/${Date.now()}_${originalname}`;

    const { data, error } = await supabase.storage
      .from('submission') // Ensure this matches your bucket name
      .upload(filePath, buffer, { contentType: mimetype });

    if (error) {
      console.error('Supabase upload error:', error);
      return res.status(500).json({ error: 'Failed to upload file' });
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase.storage.from('upload').getPublicUrl(filePath);
    const fileUrl = publicUrlData.publicUrl;

    if (!fileUrl) {
      return res.status(500).json({ error: 'Failed to get file URL' });
    }

    // Ensure the user has this prompt assigned
    const assignment = await prisma.assignedPrompt.findFirst({
      where: { userId, promptId },
    });

    if (!assignment) {
      return res.status(403).json({ error: 'You are not assigned to this prompt' });
    }

    const date = new Date()
    const submission = await prisma.submission.create({
      data: {
        userId,
        promptId,
        status,
        fileUrl, 
        submittedAt: date,
      },
    });

    res.status(201).json({ message: 'Submission successful!', submission });
  } catch (error) {
    console.error('Error submitting prompt:', error);
    res.status(500).json({ error: 'Failed to submit prompt' });
  }
});



app.get('/admin/prompts', authenticateJWT, async (req, res) => {
  
  if (req.user.userRole !== 'admin' && req.user.userRole !== 'ADMIN') {
    return res.status(403).send('Access denied');  
  }
  const prompts = await prisma.prompt.findMany();
  res.json(prompts);
});

app.get('/dashboard', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user's ID is stored in the token

      console.log(userId)
    // Get the assigned prompts for the user
    const assignedPrompts = await prisma.assignedPrompt.findMany({
      where: { userId: userId },
      include: {
        prompt: true,  // Include the related prompt details
      },
    });

    // Extract the prompts from the assigned prompts
    const prompts = assignedPrompts.map(assigned => assigned.prompt);

    res.json(prompts);
  } catch (error) {
    console.error('Error fetching assigned prompts:', error);
    res.status(500).send('Error fetching assigned prompts');
  }
});


app.post('/assign-prompt', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { userId, promptId, deadline } = req.body;

  try {
    const assignment = await prisma.assignedPrompt.create({
      data: {
        userId,
        promptId,
        deadline: new Date(deadline),
      },
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error assigning prompt:', error);
    res.status(500).json({ error: 'Failed to assign prompt' });
  }
});


// Start Server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

