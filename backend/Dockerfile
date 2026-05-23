from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Монтируем статику (ваш фронт)
app.mount("/", StaticFiles(directory="app/static", html=True), name="static")
