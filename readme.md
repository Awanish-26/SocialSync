# SocialSync

SocialSync is a tool designed to synchronize and manage your social media accounts efficiently.

## Setup Instructions

Follow these steps to set up the project:

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Git](https://git-scm.com/)
- [Python](https://www.python.org/) (v3.8 or higher)
- A package manager like `npm` or `yarn`

### Installation

#### Frontend (Vite + React)

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/SocialSync.git
   cd SocialSync/frontend
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

   or if using `yarn`:

   ```bash
   yarn install
   ```

3. **Start the Frontend**
   ```bash
   npm run dev
   ```

#### Backend (Django)

1. **Navigate to the Backend Directory**

   ```bash
   cd ../backend
   ```

2. **Set Up a Virtual Environment**

   ```bash
   pip create venv env
   ```

3. **Install Dependencies**

- cd backend

  ```bash
  pip install -r requirements.txt
  ```

4. **Set Up Environment Variables**
   Create a `.env` file in the backend directory and configure the required variables:

   ```env
   SECRET_KEY=your_secret_key
   DATABASE_URL=your_database_url
   ```

5. **Run Database Migrations**

   ```bash
   python manage.py migrate
   ```

6. **Start the Backend**
   ```bash
   python manage.py runserver
   ```

### Contributing

Feel free to submit issues or pull requests to improve the project.

### License

This project is licensed under the [MIT License](LICENSE).
