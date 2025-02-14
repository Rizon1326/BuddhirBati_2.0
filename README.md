
# Buddhir Bati - Mini Stack Overflow Clone

This project is a Mini Stack Overflow Clone built using the MERN stack (MongoDB, Express, React, Node.js). It allows users to ask questions, provide answers, and share resources such as images, PDFs, and code files based on file type.

## Features ✨

- **User Authentication 🔐**: Secure user registration and login.
- **Ask Questions ❓**: Users can post their questions.
- **Provide Answers 💬**: Other users can answer questions.
- **File Uploads 📁**:
  - Save images 🖼️, PDFs 📄, and code files 💻.
  - Automatically categorize code files by type (e.g., .js, .py, .java).
- **MinIO Integration 🗄️**: Efficient and secure storage for uploaded files.
- **Search Functionality 🔍**: Search questions using keywords or tags.
- **Responsive Design 📱**: Fully functional on mobile and desktop.
## Video
https://github.com/user-attachments/assets/884cfb29-8a83-46e5-8bfe-790afc64b74e

## Tech Stack 🛠️

- **Frontend**: React.js ⚛️
- **Backend**: Node.js, Express.js 🚀
- **Database**: MongoDB 🍃
- **Storage**: MinIO for file storage 🗄️
- **Styling**: Tailwind CSS 🎨
- **Deployment**: (Add your deployment platform, e.g., Heroku, Vercel, AWS) 🌐

## Installation Instructions 🎉

### Cloning the Repository

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/Rizon1326/BuddhirBati_2.0.git
   ```

2. Navigate into the project directory:

   ```bash
   cd buddhir-bati
   ```

### Frontend Setup

1. Navigate to the `/client` directory:

   ```bash
   cd client
   ```

2. Install the dependencies by running:

   ```bash
   npm install
   ```

3. Run the following command to start the frontend:

   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the root `/tempo` directory:

   ```bash
   cd ..
   ```

2. Build and start the backend using Docker Compose:

   ```bash
   docker compose up --build
   ```

3. To stop and clean the backend image:

   ```bash
   docker down
   ```

## After Installation 🎉

Once the application is installed and running, follow these steps:

### 1️⃣ Set Up a Test User Account 👤
- Visit the signup page.
- Create a new account.

### 2️⃣ Post a Question ❓
- Log in to your account.
- Navigate to the "Ask Question" section.
- Post a question.

### 3️⃣ Upload Files 📂
- While asking or answering a question, upload:
  - Code files 💻 (e.g., .js, .py, .java).

### 4️⃣ Answer a Question 💬
- Go to a posted question.
- Provide an answer.

### 5️⃣ Search Questions 🔍
- Use the search bar to find questions using keywords or tags.

## License

This project is open source and available under the [MIT License](LICENSE).
```

Now, the README includes the instructions for cloning the repository and setting up the project. Let me know if you need any further changes!
