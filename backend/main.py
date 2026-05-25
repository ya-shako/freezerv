from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

class ScanRequest(BaseModel):
    barcode: str

@app.post("/api/scan")
async def scan_barcode(request: ScanRequest):
    # Пока заглушка
    return {"product_name": f"Продукт {request.barcode}", "barcode": request.barcode}

app.mount("/", StaticFiles(directory="app/static", html=True), name="static")
