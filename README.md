# 📝 Notes Manager App

<div align="center">

![Notes Manager](https://img.shields.io/badge/Notes-Manager-blue?style=for-the-badge&logo=notion&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

*A modern, full-stack notes management application with user authentication and admin panel*

</div>

---

## 🚀 Features

### 👤 **User Features**
- ✅ **User Registration & Login** - Secure email/password authentication
- ✅ **Personal Notes Dashboard** - Clean, intuitive interface
- ✅ **Create Notes** - Add notes with title and description
- ✅ **View Notes** - See all your personal notes in a beautiful grid layout
- ✅ **Edit Notes** - Update existing notes with inline editing
- ✅ **Delete Notes** - Remove notes with confirmation
- ✅ **Responsive Design** - Works perfectly on desktop and mobile


### 🛡️ **Admin Features**
- ✅ **Admin Dashboard** - Dedicated admin panel at `/admin`
- ✅ **User Management** - View all registered users (except admin)
- ✅ **Notes Oversight** - View all notes from all users
- ✅ **Note Moderation** - Delete inappropriate notes
- ✅ **Admin Creation** - Easy admin user setup via web interface
- ✅ **Access Control** - Admin-only routes with proper authentication

### 🔒 **Security Features**
- 🔐 **JWT Authentication** - Secure token-based authentication
- 🔑 **Password Hashing** - bcryptjs encryption for passwords
- 🛡️ **Route Protection** - Middleware-based route security
- 👥 **User Isolation** - Users can only access their own notes

---

## 🛠️ Tech Stack

<div align="center">

| Frontend | Backend | Database | Authentication | Styling |
|----------|---------|----------|----------------|---------|
| ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) | ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) | ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white) | ![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens) | ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) |
| Next.js 15 | API Routes | Mongoose ODM | JSON Web Tokens | Tailwind CSS |
| React 19 | Express-like | Atlas Cloud | bcryptjs | Responsive Design |

</div>

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- 📟 **Node.js** (v18 or higher)
- 📦 **npm** or **yarn**
- 🍃 **MongoDB Atlas account** (free tier available)

---

## ⚡ Quick Setup

### 1️⃣ **Clone & Install**

```bash
# Clone the repository
git clone <your-repo-url>
cd notes-manager

# Install dependencies
npm install
```

### 2️⃣ **Environment Configuration**

Create a `.env.local` file in the root directory:

```env
# Database Configuration
MONGODB_URI=your_mongodb_connection_string_here

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters

# Admin Credentials (for production deployment)
ADMIN_EMAIL=your_admin_email@example.com
ADMIN_PASSWORD=your_secure_admin_password
ADMIN_NAME=Your Admin Name
```

📚 **How to get these values:**

<details>
<summary>🍃 <strong>MongoDB URI Setup</strong></summary>

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with your preferred database name

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/notesapp?retryWrites=true&w=majority`
</details>

<details>
<summary>🔑 <strong>JWT Secret Generation</strong></summary>

Generate a secure JWT secret:

```bash
# Option 1: Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Option 2: Online generator
# Visit: https://generate-secret.vercel.app/32
```
</details>

### 3️⃣ **Run the Application**

```bash
# Start development server
npm run dev

# 🌐 Open http://localhost:3000 in your browser
```

### 4️⃣ **Create Admin User**

<details>
<summary>🔒 <strong>Admin Setup (IMPORTANT for Security)</strong></summary>

**For Local Development:**
- Visit `http://localhost:3000/create-admin`
- Uses default credentials: `admin@notes.com` / `admin123`

**For Production Deployment:**
- ⚠️ **NEVER use default credentials in production!**
- Set custom admin credentials in environment variables:
  ```env
  ADMIN_EMAIL=your_secure_admin@yourdomain.com
  ADMIN_PASSWORD=your_very_secure_password_here
  ADMIN_NAME=Your Admin Name
  ```
- Then visit `/create-admin` to create admin with your secure credentials
- **Keep these credentials private and secure!**

</details>

---

## 📱 Application Routes

### 🌐 **Public Routes**
| Route | Description | Icon |
|-------|-------------|------|
| `/` | 🏠 Home/Landing page |
| `/login` | 🔐 User login |
| `/register` | 📝 User registration |
| `/create-admin` | 👑 Admin creation (one-time setup) |

### 🔒 **Protected Routes** (Requires Authentication)
| Route | Description | Access | Icon |
|-------|-------------|--------|------|
| `/dashboard` | 📊 User notes dashboard | Users Only |
| `/admin` | 🛡️ Admin management panel | Admin Only |

---

## 🔌 API Documentation

### 🔐 **Authentication Endpoints**

<details>
<summary><strong>POST</strong> <code>/api/auth/register</code> - Register New User</summary>

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "token": "jwt_token_here"
}
```
</details>

<details>
<summary><strong>POST</strong> <code>/api/auth/login</code> - User Login</summary>

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```
</details>

### 📝 **Notes Endpoints** (Protected)

<details>
<summary><strong>GET</strong> <code>/api/notes</code> - Get User's Notes</summary>

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response:**
```json
{
  "notes": [
    {
      "_id": "note_id",
      "title": "My Note",
      "description": "Note content here",
      "userId": "user_id",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```
</details>

<details>
<summary><strong>POST</strong> <code>/api/notes</code> - Create New Note</summary>

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "title": "My New Note",
  "description": "This is the content of my note"
}
```
</details>

<details>
<summary><strong>PUT</strong> <code>/api/notes/[id]</code> - Update Note</summary>

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request Body:**
```json
{
  "title": "Updated Note Title",
  "description": "Updated note content"
}
```
</details>

<details>
<summary><strong>DELETE</strong> <code>/api/notes/[id]</code> - Delete Note</summary>

**Headers:**
```
Authorization: Bearer jwt_token_here
```
</details>

### 👑 **Admin Endpoints** (Admin Only)

<details>
<summary><strong>GET</strong> <code>/api/admin/users</code> - Get All Users</summary>

Returns all registered users (excluding admin user)
</details>

<details>
<summary><strong>GET</strong> <code>/api/admin/notes</code> - Get All Notes</summary>

Returns all notes from all users (excluding admin notes)
</details>

<details>
<summary><strong>DELETE</strong> <code>/api/admin/notes/[id]</code> - Delete Any Note</summary>

Allows admin to delete any user's note
</details>

---

## 📁 Project Structure

```
notes-manager/
├── 📂 app/                          # Next.js App Router
│   ├── 📂 api/                      # API Routes
│   │   ├── 📂 admin/                # Admin-only endpoints
│   │   │   ├── 📂 notes/            # Admin notes management
│   │   │   └── 📂 users/            # Admin user management
│   │   ├── 📂 auth/                 # Authentication endpoints
│   │   │   ├── 📄 login/route.js    # Login API
│   │   │   └── 📄 register/route.js # Registration API
│   │   └── 📂 notes/                # Notes CRUD endpoints
│   │       ├── 📄 route.js          # GET/POST notes
│   │       └── 📂 [id]/             # PUT/DELETE specific note
│   ├── 📂 admin/                    # Admin dashboard page
│   ├── 📂 create-admin/             # Admin creation page
│   ├── 📂 dashboard/                # User dashboard page
│   ├── 📂 login/                    # Login page
│   ├── 📂 register/                 # Registration page
│   ├── 📄 globals.css               # Global styles
│   ├── 📄 layout.js                 # Root layout
│   └── 📄 page.js                   # Home page
├── 📂 lib/                          # Utility functions
│   ├── 📄 api.js                    # Axios API helper
│   ├── 📄 auth.js                   # Auth utilities
│   ├── 📄 dbConnect.js              # MongoDB connection
│   └── 📄 jwt.js                    # JWT utilities
├── 📂 models/                       # Database models
│   ├── 📄 Note.js                   # Note model
│   └── 📄 User.js                   # User model
├── 📂 scripts/                      # Utility scripts
│   └── 📄 createAdmin.js            # Admin creation script
├── 📄 middleware.js                 # Route protection
├── 📄 next.config.mjs               # Next.js configuration
├── 📄 package.json                  # Dependencies
├── 📄 tailwind.config.js            # Tailwind configuration
└── 📄 README.md                     # This file
```

---

## 🎯 Usage Guide

### 👤 **For Regular Users**

1. **🔗 Visit** `http://localhost:3000`
2. **📝 Register** a new account at `/register`
3. **🔐 Login** with your credentials at `/login`
4. **📊 Access** your dashboard at `/dashboard`
5. **➕ Create** notes using the "Add New Note" button
6. **✏️ Edit** notes by clicking the "Edit" button on any note
7. **🗑️ Delete** notes by clicking the "Delete" button

### 👑 **For Administrators**

1. **🛠️ Setup** admin user at `/create-admin` (one-time only)
2. **🔐 Login** with admin credentials
3. **🏠 Dashboard** will show admin panel link
4. **🛡️ Access** admin features at `/admin`
5. **👥 Manage** users and moderate content
6. **🗑️ Remove** inappropriate notes

---

## 🚀 Deployment

### 📡 **Deploy to Vercel** (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### 🐳 **Deploy with Docker**

```dockerfile
# Dockerfile (create this file)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### 🌐 **Other Platforms**
- **Netlify**: Connect GitHub repo and deploy
- **Railway**: One-click deployment
- **DigitalOcean App Platform**: Deploy from GitHub

---

## 🛠️ Development

### 🔧 **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### 🧪 **Testing**

```bash
# Add your preferred testing framework
npm install --save-dev jest @testing-library/react
```

---

## 🤝 Contributing

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💻 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔄 Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **MongoDB** for the flexible database
- **Tailwind CSS** for beautiful styling
- **Vercel** for seamless deployment

---

<div align="center">

**Made with ❤️ by Abhay Sharma**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)

</div>
