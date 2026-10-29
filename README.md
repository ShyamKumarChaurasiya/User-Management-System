# 👥 User Management System

A full-stack **User Management System** built with Node.js, Express.js, EJS, and MySQL. This application provides a simple interface to manage student records, perform CRUD operations, and store user passwords securely using bcrypt.

## 🚀 Features

- **Student Management** – Create, view, update, and delete student records.
- **MySQL Database** – Store and manage application data using MySQL.
- **Secure Password Hashing** – Hash passwords using bcrypt instead of storing them as plain text.
- **EJS Templates** – Render dynamic web pages using Embedded JavaScript.
- **Form Handling** – Process user input through Express routes.
- **Responsive UI** – Style application pages using CSS.
- **Database Schema** – Set up the database structure using the included SQL schema.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend web framework |
| EJS | Server-side templating |
| MySQL | Relational database |
| mysql2 | MySQL database connection |
| bcrypt | Password hashing |
| HTML5 | Page structure |
| CSS3 | Styling |
| JavaScript | Application logic |
| Nodemon | Development server |

## 📂 Project Structure

```text
User-Management-System/
│
├── public/
│   ├── app.js
│   ├── formStyle.css
│   └── style.css
│
├── views/
│   ├── count.ejs
│   ├── edit.ejs
│   ├── error.ejs
│   ├── form.ejs
│   ├── home.ejs
│   ├── show.ejs
│   ├── tableList.ejs
│   └── verify.ejs
│
├── index.js
├── schema.sql
├── package.json
├── package-lock.json
├── .gitignore
├── .env.example
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [MySQL](https://dev.mysql.com/downloads/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/ShyamKumarChaurasiya/User-Management-System.git
```

### 2. Navigate to the Project Directory

```bash
cd User-Management-System
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sigma
PORT=8080
```

Replace `your_mysql_password` with your actual MySQL password.

> **Important:** Never upload your `.env` file or database credentials to GitHub.

### 5. Set Up the Database

Open MySQL and execute the SQL statements in `schema.sql` to create the required database structure.

For example, if your database is named `sigma`:

```sql
CREATE DATABASE sigma;
USE sigma;
```

Then execute the remaining SQL statements from `schema.sql`.

### 6. Start the Application

For development:

```bash
npm run dev
```

Or, if your project uses the standard Node.js start command:

```bash
npm start
```

Open your browser and visit:

```text
http://localhost:8080
```

## 🔐 Security

This project includes password hashing using bcrypt to avoid storing passwords in plain text.

Additional security practices:

- Keep database credentials in environment variables.
- Exclude `.env` from version control.
- Validate user input on the server.
- Avoid exposing sensitive information in error messages.

## 🎯 Learning Objectives

This project helped demonstrate practical experience with:

- Building a server-side web application using Express.js.
- Connecting a Node.js application to a MySQL database.
- Implementing CRUD operations.
- Rendering dynamic pages with EJS.
- Handling forms and user input.
- Hashing passwords using bcrypt.
- Organizing a full-stack project.

## 👨‍💻 Author

**Shyam Kumar Chaurasiya**

- GitHub: [@ShyamKumarChaurasiya](https://github.com/ShyamKumarChaurasiya)

## 📌 Repository

[User Management System – GitHub](https://github.com/ShyamKumarChaurasiya/User-Management-System)

---

⭐ If you find this project useful, feel free to explore the repository!
