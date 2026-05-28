from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import Base, engine, get_db, Product

Base.metadata.create_all(bind=engine)

app = FastAPI()

class ScanRequest(BaseModel):
    barcode: str

@app.post("/api/scan")
async def scan_barcode(request: ScanRequest, db: Session = Depends(get_db)):
    product = Product(barcode=request.barcode)
    db.add(product)
    db.commit()
    return {"status": "ok"}

app.mount("/", StaticFiles(directory="app/static", html=True), name="static")
