require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mysql = require("mysql2/promise");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// 🔌 DATABASE CONNECTION (Single)
let connection;

async function connectDB() {
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD 
        });
        console.log("Database connected");
    } catch (err) {
        console.log("DB Connection Error:", err);
    }
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));


// Home Route
app.get("/" , (req, res)=>{
    res.render("home.ejs");
});

//Add student
app.get("/students/new" , (req , res) =>{
    res.render("form.ejs");
});

app.post("/students", async (req, res) => {
    let { id, username, email, password } = req.body;

    // 1. Trim inputs
    id = id?.trim();
    username = username?.trim();
    email = email?.trim();
    password = password?.trim();

    // 2. Empty check
    if (!id || !username || !email || !password) {
        return res.render("error.ejs", { message: "All fields are required" });
    }

    // 3. ID validation
    if (!/^\d+$/.test(id)) {
        return res.render("error.ejs", { message: "ID must contain only numbers" });
    }
    id = Number(id);

    // 4. Username validation
    const usernameRegex = /^[A-Za-z]+(_[A-Za-z]+)*$/;
    if (!usernameRegex.test(username)) {
        return res.render("error.ejs", {
            message: "Invalid username (only letters & single underscore allowed)"
        });
    }

    // 5. No spaces in email/password
    if (email.includes(" ") || password.includes(" ")) {
        return res.render("error.ejs", {
            message: "Email and password must not contain spaces"
        });
    }

    // 6. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.render("error.ejs", { message: "Invalid email format" });
    }

    // 7. Password validation
    const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
        return res.render("error.ejs", {
            message: "Password must be 8+ chars with letter, number & special char"
        });
    }

    try {
        //  8. Check duplicate ID
        const [idCheck] = await connection.query(
            "SELECT id FROM student WHERE id = ?",
            [id]
        );

        if (idCheck.length > 0) {
            return res.render("error.ejs", {
                message: "ID already used"
            });
        }

        //  9. Check duplicate email
        const [emailCheck] = await connection.query(
            "SELECT email FROM student WHERE email = ?",
            [email]
        );

        if (emailCheck.length > 0) {
            return res.render("error.ejs", {
                message: "Email already exists"
            });
        }

        //  10. HASH PASSWORD using your saltRounds 🔐
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //  11. Insert into DB
        const insertQuery = `
            INSERT INTO student (id, username, email, password)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await connection.query(insertQuery, [
            id,
            username,
            email,
            hashedPassword
        ]);

        //  12. Success
        if (result.affectedRows === 1) {
            return res.redirect("/students");
        } else {
            return res.render("error.ejs", {
                message: "Failed to add student"
            });
        }

    } catch (err) {
        console.log(err);

        if (err.code === "ER_DUP_ENTRY") {
            return res.render("error.ejs", {
                message: "Duplicate entry (ID or Email exists)"
            });
        }

        return res.status(500).send("Server Error");
    }
});

// Show Student Detail's Route
app.get("/students" , async (req , res) => {
    try {
        const [rows] = await connection.query("SELECT id , username , email FROM student");
        if (rows.length === 0) {
            return res.render("error.ejs", { message: "Table is empty." });
        }
        res.render("show.ejs" , {rows});
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching data.");        
    }
});

// Edit Student Username Route
app.get("/students/:id/edit" , async (req , res) => {
    let {id} = req.params;
    try {
        const [rows] = await connection.query(
          "SELECT * FROM student WHERE id = ?",
          [id]
        );
        if (rows.length === 0) {
            return res.render("error.ejs", { message: "User not found" });
        }
        let user = rows[0];
        res.render("edit.ejs", { user });
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching data.");
    }
});

app.patch("/students/:id" , async (req , res) =>{
    let { id } = req.params;
    let { username, password } = req.body;
    if (!username || !password) {
        return res.render("error.ejs", { message: "All fields are required" });
    }
    let q = "SELECT * FROM student WHERE id = ?";
    try {
        const [rows] = await connection.query(q, [id]);
        if (rows.length === 0) {
            return res.render("error.ejs", { message: "User not found" });
        }
        
        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) {
            return res.render("error.ejs", { message: "Oops! Incorrect password" });
        }
        
        let updateQuery = "UPDATE student SET username = ? WHERE id = ?";
        const [result] = await connection.query(updateQuery, [username, id]);
        
        if (result.changedRows === 1) {
            return res.redirect("/students");
        } else if (result.affectedRows === 1) {
            return res.render("error.ejs", { message: "No changes made" });
        } else {
            return res.render("error.ejs", { message: "User not found or update failed" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching data");
    }
});

//Student Delete Route
app.get("/students/:id/delete" , async (req , res) => {
    let {id} = req.params;
    try {
        const [rows] = await connection.query("SELECT id , username , email FROM student WHERE id = ?", [id]);
        if (rows.length === 0) {
            return res.render("error.ejs", { message: "User not found." });
        }
        let user = rows[0];
        res.render("verify.ejs" , {user});
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching data");      
    }
});

app.delete("/students/:id" , async (req , res) =>{
    let {id} = req.params;
    let {password} = req.body;

    if (!password) {
        return res.render("error.ejs", { message: "Password required" });
    } 

    let q = "SELECT * FROM student WHERE id = ?";

    try {
        const [rows] = await connection.query(q, [id]);

        if (rows.length === 0) {
            return res.render("error.ejs", { message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, rows[0].password);
        if (!isMatch) {
            return res.render("error.ejs", { message: "Oops! Incorrect password" });
        }
        
        let deleteQuery = "DELETE FROM student WHERE id = ? ";
        const [result] = await connection.query(deleteQuery, [id]);

        if (result.affectedRows === 1) {
            return res.redirect("/students");
        } else {
            return res.render("error.ejs", { message: "Delete failed" });
        }

    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching data");
    }
       
});

// Data Count route
app.get("/students/count" , async (req , res) => {
    try {
        const [rows] = await connection.query("SELECT COUNT(*) AS total FROM student");
        let count = rows[0].total;
        res.render("count.ejs" , {count}) ;
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching data.");        
    }
});

//Show tables Route
app.get("/tables", async (req, res) => {
    try {
        const [rows] = await connection.query("SHOW TABLES");
        res.render("tableList.ejs" , {rows});
    } catch (err) {
        console.log(err);
        res.status(500).send("Error fetching tables");
    }
});

// Connect DB and Start Server
async function startServer() {
    try {
        await connectDB();

        const port = process.env.PORT || 8080;

        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err.message);
        process.exit(1);
    }
}

startServer();