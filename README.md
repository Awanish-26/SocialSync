# SocialSync sub(mini-project)

SocialSync is a powerful tool designed to synchronize and manage your social media accounts seamlessly. It allows users to automate posts, track engagement, and maintain a consistent online presence across multiple platforms with ease.

## Team Members

- Awanish Yadav
- Abhishek Kumar
- Harsh Singh
- Vishal Bist

## Step to SetUp

1. In terminal clone this repo

```bash
git clone https://github.com/Awanish-26/SocialSync.git
```

2. Create Virtual Environment

```bash
pip install virtualenv
python -m venv env
```

3. Activate Virtual Environment

```bash
env\Scripts\activate
```

4. Backend Setup

```bash
 cd backend
 pip install -r requirements.txt
 python manage.py migrate
 python manage.py runserver
```

Now your backend server is running

5. Frontend SetUp

from root directory

```bash
cd frontend
npm install
npm run dev
```

<b>All Set To go<b> open `http://localhost:5173` in browser.
