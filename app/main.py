from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
import os

from app.api.posts import router as posts_router
from app.database.init_db import init_db

# FastAPIアプリケーション作成
app = FastAPI(
    title="SoloSlack",
    description="一人用のSlack風チャットアプリケーション",
    version="1.0.0"
)

# 静的ファイルの設定
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# テンプレートの設定
templates = Jinja2Templates(directory="app/templates")

# APIルーターの登録
app.include_router(posts_router, prefix="/api/posts", tags=["posts"])

@app.on_event("startup")
async def startup_event():
    """アプリケーション起動時の処理"""
    # データベースディレクトリの作成
    os.makedirs("database", exist_ok=True)
    # データベースの初期化
    init_db()

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    """メインページの表示"""
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/health")
async def health_check():
    """ヘルスチェックエンドポイント"""
    return {"status": "healthy", "message": "SoloSlack is running"} 