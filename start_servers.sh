#!/bin/bash
cd backend
python manage.py runserver &
cd ../frontend
npm run dev