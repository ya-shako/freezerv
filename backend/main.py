from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from database import engine, Base

# Создаём таблицы
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.mount("/", StaticFiles(directory="app/static", html=True), name="static")
