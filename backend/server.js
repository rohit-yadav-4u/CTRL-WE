const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection setup - update with your credentials
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Palpath2409', // update with your MySQL password
  database: 'login_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database.');

  // Create users table if not exists
  const createTableQuery = `CREATE TABLE IF NOT EXISTS users (
  
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    fullName VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
  )`;
  db.query(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating users table:', err);
      process.exit(1);
    }
    console.log('Users table ready.');
  });
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  console.log('Signup request body:', req.body); // Log received data
  const { email, fullName, username, password } = req.body;
  if (!email || !fullName || !username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if username already exists
    const [rows] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await db.promise().query(
      'INSERT INTO users (email, fullName, username, password) VALUES (?, ?, ?, ?)',
      [email, fullName, username, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const [rows] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    res.json({ message: 'Login successful.', user: { id: user.id, username: user.username, fullName: user.fullName, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
