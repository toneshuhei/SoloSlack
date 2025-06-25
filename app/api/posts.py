from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.database.database import get_db
from app.models.post import Post

router = APIRouter()

# Pydanticモデル
class PostCreate(BaseModel):
    content: str
    tag: Optional[str] = None

class PostResponse(BaseModel):
    id: int
    content: str
    tag: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class PostsResponse(BaseModel):
    posts: List[PostResponse]
    total: int

@router.get("/", response_model=PostsResponse)
def get_posts(
    tag: Optional[str] = Query(None, description="タグによるフィルタ"),
    limit: int = Query(50, description="取得件数"),
    db: Session = Depends(get_db)
):
    """投稿一覧を取得"""
    query = db.query(Post)
    
    if tag:
        query = query.filter(Post.tag == tag)
    
    posts = query.order_by(Post.created_at.desc()).limit(limit).all()
    total = query.count()
    
    return PostsResponse(
        posts=[PostResponse.from_orm(post) for post in posts],
        total=total
    )

@router.post("/", response_model=PostResponse)
def create_post(post: PostCreate, db: Session = Depends(get_db)):
    """新規投稿を作成"""
    db_post = Post(
        content=post.content,
        tag=post.tag
    )
    
    try:
        db.add(db_post)
        db.commit()
        db.refresh(db_post)
        return PostResponse.from_orm(db_post)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="投稿の保存に失敗しました") 