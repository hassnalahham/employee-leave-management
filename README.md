# Employee Leave Management System

## Project Overview

A full-stack web application for managing employee leave. Employees submit leave
requests and track their status; managers review every request across the team and
approve or reject it.

The system has two roles, and each sees a different application:

**Employee**

- Log in to the application
- View a personal dashboard with Pending / Approved / Rejected totals
- Submit a leave request (leave type, start date, end date, reason)
- View all previously submitted requests and the status of each
- Withdraw a request while it is still pending

**Manager**

- Log in as a manager
- View all leave requests from every employee
- Approve or reject requests, from the list or the detail page
- Search leave requests by employee name
- Filter requests by status

Every request starts as **Pending** and moves to **Approved** or **Rejected** once a
manager decides. Roles are enforced on both the client and the server, so an employee
cannot reach manager screens or manager API routes.

---

## Technologies Used

| Layer            | Technology                                                         |
| ---------------- | ------------------------------------------------------------------ |
| Frontend         | React, Vite, React Router                                          |
| Backend          | Node.js, Express 5                                                 |
| Database         | MongoDB (MongoDB Atlas), Mongoose ODM                              |
| Authentication   | JSON Web Tokens (`jsonwebtoken`), password hashing with `bcryptjs` |
| Supporting tools | `cors`, `dotenv`, ESLint                                           |
| Version control  | Git & GitHub                                                       |

---

## Setup Instructions

### Prerequisites

- **Node.js 18+**
- **MongoDB** — either a local installation or a free MongoDB Atlas cluster

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `backend/.env` and set your connection string:

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=leave_management
```

| Key           | Description                                | Default                                      |
| ------------- | ------------------------------------------ | -------------------------------------------- |
| `PORT`        | Port the API listens on                    | `5000`                                       |
| `MONGODB_URI` | MongoDB connection string (local or Atlas) | `mongodb://127.0.0.1:27017/leave_management` |
| `MONGODB_DB`  | Database name                              | `leave_management`                           |
| `JWT_SECRET`  | Optional signing key for tokens            | built-in development key                     |

If you use a **local** MongoDB instead of Atlas, set
`MONGODB_URI=mongodb://127.0.0.1:27017/leave_management`.

Start the API:

```bash
npm run dev     
```

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev   
```

`frontend/.env` holds the API location. The default works with the setup above:

```
VITE_API_URL=http://localhost:5000/api
```

### 3. First run

Open the frontend URL, click **"No account? Sign up"**, and create two accounts: one
with the **Manager** role and one with the **Employee** role. Log in as the employee
to submit requests, then log in as the manager to approve or reject them.

---

## Working Frontend and Backend Application

### Architecture

The frontend and backend are separate applications that communicate over a JSON REST
API. The browser never talks to MongoDB directly.

### Authentication flow

1. The user submits the login form; the client calls `POST /api/auth/login`.
2. The server looks the user up by email and compares the submitted password against
   the stored bcrypt hash.
3. On success it returns a JWT containing the user's id, name, and role.
4. The client stores the token and attaches it to every later request as
   `Authorization: Bearer <token>`.
5. The `auth` middleware verifies the token on protected routes, and
   `requireRole("Manager")` additionally restricts the manager-only routes.

Sessions survive a page refresh: `AuthContext` re-validates the stored token against
`GET /api/auth/me` when the app loads.

## MongoDB Database Integration

### Connection

`backend/config/db.js` connects with Mongoose at startup, and the server only begins
listening once the connection succeeds:

```js
const uri = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_URI;

await mongoose.connect(uri, {
  dbName: process.env.MONGODB_DB || "leave_management",
});
```

`dbName` is passed explicitly because Atlas connection strings usually end at the host
with no database in the path. Without it, every collection would be created in a
database called `test`.

### Collections

The database `leave_management` holds two collections.

**`users`**

| Field      | Type   | Notes                                        |
| ---------- | ------ | -------------------------------------------- |
| `name`     | String | Required                                     |
| `email`    | String | Required, unique, lowercased                 |
| `password` | String | Required, stored as a bcrypt hash            |
| `role`     | String | `Employee` or `Manager` (default `Employee`) |

**`leaverequests`**

| Field         | Type     | Notes                                                    |
| ------------- | -------- | -------------------------------------------------------- |
| `employeeId`  | ObjectId | Required, references `User`                              |
| `leaveType`   | String   | `Annual`, `Sick`, `Unpaid`, `Maternity`, or `Other`      |
| `startDate`   | Date     | Required                                                 |
| `endDate`     | Date     | Required                                                 |
| `reason`      | String   | Required                                                 |
| `status`      | String   | `Pending`, `Approved`, or `Rejected` (default `Pending`) |
| `createdDate` | Date     | Defaults to the time of submission                       |

---

## Demo

https://github.com/user-attachments/assets/8d1e4074-3c1c-4fd9-954e-968cd89cf41a




