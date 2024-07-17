require("dotenv").config();

const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);
const express = require("express");
const nodemailer = require("nodemailer");
const mysql = require("mysql2/promise");
const mysqldatabase = require("mysql");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
app.use(bodyParser.json());
app.use(express.json());
const cors = require("cors");
const { request } = require("http");
app.use(cors());
app.use(express.static("public/images"));

// const port = process.env.PORT || 3000;
const port = 3000;
const host = process.env.HOST;
const user = process.env.USER;
const password = process.env.PASSWORD;

const database = process.env.DATABASE;

const db = mysqldatabase.createPool({
  connectionLimit: 20,
  connectTimeout: 60 * 60 * 1000,
  timeout: 60 * 60 * 1000,
  host: host,
  user: user,
  password: password,
  database: database,
});

// Store the database connection in a global variable
let dbConnection;

// Get a connection from the pool and store it in the global variable
db.getConnection((error, connection) => {
  if (error) {
    console.error("Error connecting to the database:", error);
  } else {
    console.log("Successfully connected to the database");
    dbConnection = connection;
    handleNewData();
  }
});

// app.get("/", (req, res) => {
//   res.send("hello world");
// });
// get all cars in case the search bar is searching for all

//************************************** */

const { generateRoutes } = require("./routes");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
generateRoutes(app);

function handleNewData() {
  const sqlSelect = "SELECT * FROM newData";

  dbConnection.query(sqlSelect, (error, results, fields) => {
    if (error) {
      console.error(error);
      return;
    }

    const newDataRows = results;

    const insertPromises = newDataRows.map((row) => {
      const {
        name,
        model,
        type,
        numOfSeats,
        bagageSpace,
        transmission,
        price,
        stars,
        specs,
        image,
      } = row;

      // Transform the blob image into a file and save it to /public/images/cars
      const imageDataBase64 = image.toString("base64");
      const imageName = `${name}-${model}.jpg`; // Example: Kia-Serato.jpg
      const imagePath = `public/images/cars/${imageName}`;

      // Write the image file to the specified path
      fs.writeFileSync(imagePath, imageDataBase64, "base64");

      // Construct the URL for the car's image
      const imageUrl = `./public/images/cars/${imageName}`;

      // Prepare SQL to insert data into cars table
      const sqlInsert = `
        INSERT INTO cars (name, model, type, numOfSeats, bagageSpace, transmission, price, stars, specs, url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      return new Promise((resolve, reject) => {
        dbConnection.query(
          sqlInsert,
          [
            name,
            model,
            type,
            numOfSeats,
            bagageSpace,
            transmission,
            price,
            stars,
            specs,
            imageUrl,
          ],
          (error, results) => {
            if (error) {
              console.error(error);
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
    });

    // Wait for all insert promises to complete
    Promise.all(insertPromises)
      .then(() => {
        // Once all new data is inserted, delete all data from newData table
        const sqlDelete = "DELETE FROM newData";
        dbConnection.query(sqlDelete, (error, results) => {
          if (error) {
            console.error(error);
          } else {
            console.log("table cleared successfully.");
          }
        });
      })
      .catch((error) => {
        console.error("Error inserting new data:", error);
      });
  });
}

app.get("/api/cars/all", async (req, res) => {
  handleNewData();
  const sql = "SELECT * FROM cars";
  // Query the database for all rows in the "info" table
  // const [rows] ;
  const rows = [];
  dbConnection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      for (const row of results) {
        rows.push(row);
      }
      const infoArrayWithImages = rows.map((info) => {
        // Read the image file and encode it as base64
        const imageData = fs.readFileSync(info.url);

        const imageDataBase64 = Buffer.from(imageData).toString("base64");

        // Return a new object with the image data included

        return {
          info: info,
          imageData: imageDataBase64,
        };
      });

      // Send the array as the response
      res.json(infoArrayWithImages);
    }
  });
});

// end of get all cars request now

// START OF get car by brand request

//******************************* */
app.get("/api/cars/:brand", async (req, res) => {
  let carBrand = req.params.brand;
  const rows = [];
  const sql = `SELECT * FROM cars WHERE name="${carBrand}"`;
  dbConnection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      for (const row of results) {
        rows.push(row);
      }
      const infoArrayWithImages = rows.map((info) => {
        // Read the image file and encode it as base64
        const imageData = fs.readFileSync(info.url);

        const imageDataBase64 = Buffer.from(imageData).toString("base64");

        // Return a new object with the image data included

        return {
          info: info,
          imageData: imageDataBase64,
        };
      });

      // Send the array as the response
      res.json(infoArrayWithImages);
    }
  });
});

// end of get get cars by brand request now

// START OF get car by type request

//******************************* */
app.get("/api/cars/bytype/:type", async (req, res) => {
  let carType = req.params.type;
  const rows = [];
  const sql = `SELECT * FROM cars WHERE type="${carType}"`;
  dbConnection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      for (const row of results) {
        rows.push(row);
      }
      const infoArrayWithImages = rows.map((info) => {
        // Read the image file and encode it as base64
        const imageData = fs.readFileSync(info.url);

        const imageDataBase64 = Buffer.from(imageData).toString("base64");

        // Return a new object with the image data included

        return {
          info: info,
          imageData: imageDataBase64,
        };
      });

      // Send the array as the response
      res.json(infoArrayWithImages);
    }
  });
});

// end of get get cars by type request now

// START OF get car by type and by brand request

//******************************* */
app.get("/api/cars/byboth/:brand/:type", async (req, res) => {
  let carType = req.params.type;
  let carBrand = req.params.brand;
  const rows = [];
  const sql = `SELECT * FROM cars WHERE type="${carType}" AND name="${carBrand}"`;
  dbConnection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      for (const row of results) {
        rows.push(row);
      }
      const infoArrayWithImages = rows.map((info) => {
        // Read the image file and encode it as base64
        const imageData = fs.readFileSync(info.url);

        const imageDataBase64 = Buffer.from(imageData).toString("base64");

        // Return a new object with the image data included

        return {
          info: info,
          imageData: imageDataBase64,
        };
      });

      // Send the array as the response
      res.json(infoArrayWithImages);
    }
  });
});

// **********************************

// START OF get specific car

//******************************* */
app.get("/api/cars/specificcar/:name/:model", async (req, res) => {
  let carName = req.params.name;
  let carModel = req.params.model;
  const rows = [];
  const sql = `SELECT * FROM cars WHERE name="${carName}" AND model="${carModel}"`;
  dbConnection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      for (const row of results) {
        rows.push(row);
      }

      const infoArrayWithImages = rows.map((info) => {
        // Read the image file and encode it as base64
        const imageData = fs.readFileSync(info.url);

        const imageDataBase64 = Buffer.from(imageData).toString("base64");

        // Return a new object with the image data included

        return {
          info: info,
          imageData: imageDataBase64,
        };
      });

      // Send the array as the response
      res.json(infoArrayWithImages);
    }
  });
});

// **********************

// GET request for getting similar cars limit 3

// //******************* */

app.get("/api/cars/similar/:name/:model", async (req, res) => {
  let carName = req.params.name;
  let carModel = req.params.model;
  const rows = [];
  const sql = `SELECT * FROM cars WHERE name="${carName}" AND model <> "${carModel}" ORDER BY price ASC LIMIT 3;`;
  dbConnection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      for (const row of results) {
        rows.push(row);
      }
      const infoArrayWithImages = rows.map((info) => {
        // Read the image file and encode it as base64
        const imageData = fs.readFileSync(info.url);

        const imageDataBase64 = Buffer.from(imageData).toString("base64");

        // Return a new object with the image data included

        return {
          info: info,
          imageData: imageDataBase64,
        };
      });

      // Send the array as the response
      res.json(infoArrayWithImages);
    }
  });
});

// here i will handel the request to get the info about our team

// here i am setting the post route for the form and since
// i never trust front end input validation and since this is posting to the database i am here validating again the inputs
const crypto = require("crypto");

app.post("/form/form-submission", async (req, res) => {
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

  // Encrypt the password using the SHA-256 algorithm
  const passwordHash = crypto
    .createHash("sha256")
    .update(myPassword)
    .digest("hex");

  // If all validation checks pass, insert the data into the MySQL database

  // Insert the form data into the users table
  try {
    const sql2 =
      "INSERT INTO users (fullName, phone, email, password) VALUES (?, ?, ?, ?)";
    dbConnection.query(
      sql2,
      [fullName, phone, email, passwordHash],
      (error, results, fields) => {
        if (error) {
          if (error.code === "ER_DUP_ENTRY") {
            // Email already exists, send an error message
            res.status(401).send("Email already exists");
          } else {
            console.log(error);
          }
        } else {
          res.status(200).send("Form submission successful");
        }
      }
    );
  } catch (error) {
    res.send("Form submission failed");
  }
});

// here i will handle the login request//

app.get("/api/aboutUs/teams/all", async (req, res) => {
  // Query the database for all rows in the "info" table
  const sql = "SELECT * FROM teams";

  try {
    const results = await new Promise((resolve, reject) => {
      dbConnection.query(sql, (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    const infoArrayWithImages = [];

    for (const info of results) {
      // Read the image file and encode it as base64
      const imageData = fs.readFileSync(info.url);

      const imageDataBase64 = Buffer.from(imageData).toString("base64");

      // Add the new object with the image data to the array
      infoArrayWithImages.push({
        info: info,
        imageData: imageDataBase64,
      });
    }

    // Send the array as the response
    res.json(infoArrayWithImages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving team info");
  }
});

// *****************************

// now handel the top sellers cars get request

//******************************* */

app.get("/api/cars/topsellers/all", async (req, res) => {
  // Query the database for all rows in the "info" table
  const rows = [];
  const sql = "SELECT * FROM topsellers";
  dbConnection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      for (const row of results) {
        rows.push(row);
      }
      const infoArrayWithImages = rows.map((info) => {
        // Read the image file and encode it as base64
        const imageData = fs.readFileSync(info.carUrl);

        const imageDataBase64 = Buffer.from(imageData).toString("base64");

        // Return a new object with the image data included

        return {
          imageData: imageDataBase64,
        };
      });

      // Send the array as the response
      res.json(infoArrayWithImages);
    }
  });
});

// *****************************

// now handel the main page cars ny name get request

//***************************** */

app.get("/api/cars/carByName/all", async (req, res) => {
  // Query the database for all rows in the "info" table
  const rows = [];
  const sql = "SELECT * FROM carbyname";
  dbConnection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      for (const row of results) {
        rows.push(row);
      }
      const infoArrayWithImages = rows.map((info) => {
        // Read the image file and encode it as base64
        const imageData = fs.readFileSync(info.url);

        const imageDataBase64 = Buffer.from(imageData).toString("base64");

        // Return a new object with the image data included

        return {
          name: info.name,
          imageData: imageDataBase64,
        };
      });

      // Send the array as the response
      res.json(infoArrayWithImages);
    }
  });
});

// *****************************

// now handel the main page cars ny type get request

//******************************* */

app.get("/api/cars/carByType/all", async (req, res) => {
  // Query the database for all rows in the "info" table
  const rows = [];
  const sql = "SELECT * FROM carbytype";
  dbConnection.query(sql, (error, results, fields) => {
    if (error) {
      console.error(error);
    } else {
      for (const row of results) {
        rows.push(row);
      }

      const infoArrayWithImages = rows.map((info) => {
        // Read the image file and encode it as base64
        const imageData = fs.readFileSync(info.url);

        const imageDataBase64 = Buffer.from(imageData).toString("base64");

        // Return a new object with the image data included

        return {
          name: info.name,
          imageData: imageDataBase64,
        };
      });

      // Send the array as the response
      res.json(infoArrayWithImages);
    }
  });
});

app.post("/form/form-login", async (req, res) => {
  try {
    // Retrieve email and password from request body
    const email = req.body.email;
    const myPassword = req.body.password;

    // Encrypt the password using the SHA-256 algorithm
    const passwordHash = crypto
      .createHash("sha256")
      .update(myPassword)
      .digest("hex");

    const rows = [];
    const sql = "SELECT id FROM users WHERE email = ? AND BINARY password = ?";
    dbConnection.query(sql, [email, passwordHash], (error, results, fields) => {
      if (error) {
        console.error(error);
      } else {
        for (const row of results) {
          rows.push(row);
        }
      }
      if (rows.length === 0) {
        return res.status(401).send("Invalid email or password");
      }

      // If a result is found, return the user's ID
      const myUser = rows[0];

      res.send({ message: "Login successful", userId: myUser.id });
    });
    // Execute MySQL query to check if email and password are correct
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// now  i will handle the purchase car
const { check, validationResult } = require("express-validator");
const { options } = require("joi");

app.post(
  "/form/purchase-car",
  [
    // Validate that the name field is not empty
    check("name").not().isEmpty(),
    // Validate that the name field does not contain numbers
    check("name").not().matches(/\d/),
    // Validate that the email field is not empty and is in the correct format
    check("email").not().isEmpty().isEmail(),
    // Validate that the phone field is not empty and matches the pattern +<numbers>
    check("phone")
      .not()
      .isEmpty()
      .matches(/^\+?\d+$/),
    // Validate that the pick up address field is not empty
    check("pickUpAddress").not().isEmpty(),
    // Validate that the pick up date field is not empty
    check("pickUpAddress").not().isEmpty(),
    check("pickUpDate").not().isEmpty(),
    // Validate that the pick up time field is not empty
    check("pickUpTime").not().isEmpty(),
    // Validate that the drop off address field is not empty
    check("dropOffAddress").not().isEmpty(),
    // Validate that the drop off date field is not empty
    check("dropOffDate").not().isEmpty(),
    // Validate that the drop off time field is not empty
    check("dropOffTime").not().isEmpty(),
    check("status").not().isEmpty(),
  ],
  async (req, res) => {
    // Check if there are any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are, send a 400 Bad Request response with the errors
      return res.status(400).json({ errors: errors.array() });
    }

    // If the input is valid, you can proceed with creating a connection to the database

    // Sanitize the form data to prevent SQL injection attacks
    const {
      name,
      email,
      phone,
      pickUpAddress,
      pickUpDate,
      pickUpTime,
      dropOffAddress,
      dropOffDate,
      dropOffTime,
      carname,
      carmodel,
      status,
    } = req.body;
    const sanitizedName = mysql.escape(name);
    const sanitizedEmail = mysql.escape(email);
    const sanitizedPhone = mysql.escape(phone);
    const sanitizedPickUpAddress = mysql.escape(pickUpAddress);
    const sanitizedPickUpDate = mysql.escape(pickUpDate);
    const sanitizedPickUpTime = mysql.escape(pickUpTime);
    const sanitizedDropOffAddress = mysql.escape(dropOffAddress);
    const sanitizedDropOffDate = mysql.escape(dropOffDate);
    const sanitizedDropOffTime = mysql.escape(dropOffTime);
    const sanitizedCarName = mysql.escape(carname);
    const sanitizedCarModel = mysql.escape(carmodel);
    const sanitizedStatus = mysql.escape(status);

    // Insert the sanitized form data into the purchcars table
    // Insert the sanitized form data into the purchcars table
    const sql =
      "INSERT INTO purchcars (name, email, phone, pickUpAddress, pickUpDate, pickUpTime, dropOffAddress, dropOffDate, dropOffTime,carname,carmodel,status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)";
    dbConnection.query(
      sql,
      [
        sanitizedName,
        sanitizedEmail,
        sanitizedPhone,
        sanitizedPickUpAddress,
        sanitizedPickUpDate,
        sanitizedPickUpTime,
        sanitizedDropOffAddress,
        sanitizedDropOffDate,
        sanitizedDropOffTime,
        sanitizedCarName,
        sanitizedCarModel,
        sanitizedStatus,
      ],
      (error, results, fields) => {
        if (error) {
          console.log(error);
        } else {
          // Send a success response
          res.status(200).send("success");
        }
      }
    );
  }
);

// handeling post of the user sending email

app.post("/contact/send-email", async (req, res) => {
  const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
      user: "TCarRentalweb@outlook.com",
      pass: "aimTony333123.",
    },
  });
  const { name, email, subject, message } = req.body;
  const mailOptions = {
    from: "TCarRentalweb@outlook.com",
    to: "TCarRentalwebReciever@outlook.com",
    subject: `name: ${name}, email: ${email} , subject: ${subject}`,
    text: message,
  };
  try {
    // send email
    await transporter.sendMail(mailOptions);

    res.status(200).send("success");
  } catch (error) {
    res.status(400).message("failed to send email");
  }
});

// handeling the post to add a subscriber

app.post(
  "/subscribe",
  [
    check("email").not().isEmpty().isEmail(),
    check("id").not().isEmpty().matches(/\d/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are, send a 400 Bad Request response with the errors
      return res.status(400).json({ errors: errors.array() });
    }

    // If the input is valid, you can proceed with creating a connection to the database

    const { id, email } = req.body;
    const sanitizedId = mysql.escape(id);

    const sanitizedEmail = mysql.escape(email);
    const sql = "INSERT INTO subscribers (id,email) VALUES (?,?)";
    dbConnection.query(
      sql,
      [sanitizedId, sanitizedEmail],
      (error, results, fields) => {
        if (error) {
          if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).send({ error: "Id already exists" });
          } else {
            console.log(error);
          }
        } else {
          res.status(200).send("success");
        }
      }
    );
  }
);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
