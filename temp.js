app.post("/form/form-submission", async (req, res) => {
  const connection = await mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: database,
  });
  const fullName = req.body.fullName;
  const phone = req.body.phone;
  const email = req.body.email;
  const myPassword = req.body.password;

  // Validate the full name field
  if (!fullName) {
    return res.status(400).send("Full name is required");
  }
  if (/\d/.test(fullName)) {
    return res.status(400).send("Full name cannot contain numbers");
  }

  // Validate the phone field
  if (!phone) {
    return res.status(400).send("Phone is required");
  }
  if (!/^(\+\d+|\d+|\d{3}-\d{2}-\d{4})$/.test(phone)) {
    return res
      .status(400)
      .send(
        'Phone must contain only numbers, a plus sign, or be in the format "921-12-2134"'
      );
  }

  // Validate the email field
  if (!email) {
    return res.status(400).send("Email is required");
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res
      .status(400)
      .send('Email must be in the format "example@domain.com"');
  }

  // Validate the password field
  if (!myPassword) {
    return res.status(400).send("Password is required");
  }
  if (!/\d/.test(myPassword) || !/[A-Z]/.test(myPassword)) {
    return res
      .status(400)
      .send(
        "Password must contain at least one number and one uppercase character"
      );
  }

  // If all validation checks pass, insert the data into the MySQL database

  // Insert the form data into the users table
  try {
    // Check whether the email already exists in the database
    const emailExists = await connection.query(
      "SELECT COUNT(*) as count FROM users WHERE email = ?",
      [email]
    );

    if (emailExists[0][0].count > 0) {
      // Email already exists, send an error message
      res.status(401).send("Email already exists");
    } else {
      // Email does not exist, insert the form data into the users table
      const results = await connection.query(
        "INSERT INTO users (fullName, phone, email, password) VALUES (?, ?, ?, ?)",
        [fullName, phone, email, myPassword]
      );
      res.status(200).send("Form submission successful");
    }
  } catch (error) {
    res.send("Form submission failed");
  }
});

app.post("/form/form-login", async (req, res) => {
  try {
    // Establish MySQL connection
    const connection = await mysql.createConnection({
      host: host,
      user: user,
      password: password,
      database: database,
    });

    // Retrieve email and password from request body
    const email = req.body.email;
    const myPassword = req.body.password;

    // Execute MySQL query to check if email and password are correct
    const [results] = await connection.query(
      "SELECT id FROM users WHERE email = ? AND BINARY password = ?",
      [email, myPassword]
    );
    connection.end();

    // If no results are found, return 401 Unauthorized
    if (results.length === 0) {
      return res.status(401).send("Invalid email or password");
    }

    // If a result is found, return the user's ID
    const myUser = results[0];

    res.send({ message: "Login successful", userId: myUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});
