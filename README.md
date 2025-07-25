# 🗂️ File Viewer System with Role-Based Access 

A secure, full-stack file viewer system built entirely in **Next.js**.  
It allows users to view `.txt` files locally or fetch them from Google Drive — with **role-based access control** and a clean, responsive UI.

> 🔐 Powered by Next.js API Routes, Auth Sessions & Google Drive API

---

## 📌 Features Overview

### 🎨 Frontend UI (Next.js)
- Responsive layout using **React + Tailwind/Bootstrap**
- Navbar & footer for consistent layout
- Dropdown to select `.txt` files
- Modal dialogs for file-not-found scenarios
- Mobile-first responsive design

### ⚙️ Functional Workflow
- "View" button is disabled until a file is selected
- On selection:
  - ✅ If file exists locally → opens in system Notepad
  - ❌ If not found locally → checks Google Drive
- If file not on disk:
  - Modal: “The file is not available locally.”
  - [Download] → fetches the selected file from Google Drive only

---

## 👥 Role-Based Access Control

### 👤 Roles
- **Admin**: Full access to all modules, user management, activity logs
- **Manager**: Can view logs and monitor employee file access
- **Employee**: Limited access — view/download allowed files only

🔑 Role access is enforced on both the UI and API levels.

---

## 🛠 Tech Stack

| Layer         | Technology            |
|--------------|------------------------|
| Frontend      | Next.js (React)        |
| Backend       | Next.js API Routes     |
| Authentication| Session (Cookies/Auth) |
| Storage       | Local Files + Google Drive |
| Styles        | Tailwind CSS / Bootstrap |
| Deployment    | Node.js (Serverless-ready) |

---

## ☁ Google Drive Integration

- Publicly shared folder with `.txt` files
- If a file isn’t found locally, a call is made to fetch it from Drive
- Only the requested file is downloaded — no folder-wide access

---

## 🧪 Running the Project

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/nextjs-file-viewer.git
cd nextjs-file-viewer
