# 📝 Noteland

**A simple note-taking and task management application.**

## 🚀 Tech Stack

- **Frontend**: ReactJS (Vite)
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL

## 📌 Features

✅ Add a **note** (Title + Description).  
✅ Notes appear in the sidebar for easy access.  
✅ Clicking a note reveals its details.  
✅ Create **tasks** under a note.  
✅ Tasks are added to the **Pending Tasks** section.  
✅ Check tasks to mark them as **Completed**.

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/IncarnatorX/noteland-app.git
cd noteland
```

### 2️⃣ Setup PostgreSQL

You need to manually create **PostgreSQL credentials** and update the database connection in the backend.

- Create a new PostgreSQL database.
- Update your **.env** file with the database credentials:

```sh
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=noteland
```

### 3️⃣ Install Dependencies

#### Backend

```sh
cd backend
npm install
```

#### Frontend

```sh
cd frontend
npm install
```

### 4️⃣ Run the Application

**Backend**

> Make sure **nodemon** is installed globally:

```sh
npm install -g nodemon
```

Start the backend server:

```sh
npm run dev
```

**Frontend**

In another terminal:

```sh
cd frontend
npm run dev
```

### 5️⃣ Open in Browser

Once both the backend and frontend are running, open:

```
http://localhost:5000
```

_(Port may vary depending on Vite settings.)_
