from fastapi import APIRouter, Body, Depends, HTTPException, status
from typing import List
from datetime import datetime
from bson import ObjectId

from app.services.auth.utils import get_current_user
from app.core.database import get_database 
from .schemas import ReviewCreate, ReviewResponse, ReviewUpdate

router = APIRouter()

no_embedding_fields = {"embedding": 0}
 
# --- Yardımcı Fonksiyonlar ---
def is_valid_object_id(id_str: str) -> bool:
    """ObjectId formatını kontrol eder."""
    try:
        ObjectId(id_str)
        return True
    except:
        return False


async def update_movie_average_rating(db, movie_id: str):
    """
    Bir filme ait tüm yorumların ortalama puanını hesaplar ve
    movies koleksiyonundaki average_rating alanını günceller.
    """
    # Aggregation pipeline ile ortalama hesapla
    pipeline = [
        {"$match": {"movie_id": movie_id}},
        {"$group": {"_id": None, "avg_rating": {"$avg": "$rating"}}}
    ]
    
    result = await db.reviews.aggregate(pipeline).to_list(1)
    
    if result and result[0].get("avg_rating") is not None:
        avg_rating = round(result[0]["avg_rating"], 1)
    else:
        avg_rating = 0.0
    
    # Movies koleksiyonunu güncelle
    await db.movies.update_one(
        {"_id": ObjectId(movie_id)},
        {"$set": {"average_rating": avg_rating}}
    )


# --- CREATE ---
@router.post("/{movie_id}", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    movie_id: str,
    review: ReviewCreate = Body(...),
    db=Depends(get_database), 
    current_user=Depends(get_current_user)
):
    """
    Yeni bir film yorumu oluşturur.
    """
    # Movie ID formatını kontrol et
    if not is_valid_object_id(movie_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Geçersiz film ID formatı."
        )
    
    # Filmin var olup olmadığını kontrol et
    movie = await db.movies.find_one({"_id": ObjectId(movie_id)}, no_embedding_fields)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Film bulunamadı."
        )
    
    # Kullanıcının bu filme daha önce yorum yapıp yapmadığını kontrol et
    existing_review = await db.reviews.find_one({
        "movie_id": movie_id,
        "user_id": str(current_user["_id"])
    })
    if existing_review:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu filme zaten yorum yapmışsınız."
        )
    
    review_dict = review.model_dump()
    review_dict["movie_id"] = movie_id
    review_dict["user_id"] = str(current_user["_id"])
    review_dict["created_at"] = datetime.utcnow()
    
    result = await db.reviews.insert_one(review_dict)
    created_review = await db.reviews.find_one({"_id": result.inserted_id})
    
    if not created_review:
        raise HTTPException(status_code=500, detail="Yorum oluşturulamadı.")
    
    # Filmin ortalama puanını güncelle
    await update_movie_average_rating(db, movie_id)
    
    return ReviewResponse.model_validate(created_review)


# --- GET ALL REVIEWS FOR A MOVIE ---
@router.get("/{movie_id}", response_model=List[ReviewResponse])
async def get_movie_reviews(
    movie_id: str,
    db=Depends(get_database)
):
    """
    Bir filme ait tüm yorumları getirir.
    """
    if not is_valid_object_id(movie_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Geçersiz film ID formatı."
        )
    
    reviews = await db.reviews.find({"movie_id": movie_id}).to_list(100)
    return [ReviewResponse.model_validate(review) for review in reviews]


# --- UPDATE ---
@router.put("/{review_id}", response_model=ReviewResponse)
async def update_review(
    review_id: str,
    review_update: ReviewUpdate = Body(...),
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """
    Kullanıcının kendi yorumunu günceller.
    """
    if not is_valid_object_id(review_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Geçersiz yorum ID formatı."
        )
    
    # Yorumu bul
    existing_review = await db.reviews.find_one({"_id": ObjectId(review_id)})
    if not existing_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Yorum bulunamadı."
        )
    
    # Yorum sahibi mi kontrol et
    if existing_review["user_id"] != str(current_user["_id"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu yorumu düzenleme yetkiniz yok."
        )
    
    # Sadece dolu alanları güncelle
    update_data = {k: v for k, v in review_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Güncellenecek veri bulunamadı."
        )
    
    update_data["updated_at"] = datetime.utcnow()
    
    await db.reviews.update_one(
        {"_id": ObjectId(review_id)},
        {"$set": update_data}
    )
    
    updated_review = await db.reviews.find_one({"_id": ObjectId(review_id)})
    
    # Eğer rating güncellendiyse, filmin ortalama puanını güncelle
    if "rating" in update_data:
        await update_movie_average_rating(db, existing_review["movie_id"])
    
    return ReviewResponse.model_validate(updated_review)


# --- DELETE ---
@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(
    review_id: str,
    db=Depends(get_database),
    current_user=Depends(get_current_user)
):
    """
    Kullanıcının kendi yorumunu siler.
    """
    if not is_valid_object_id(review_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Geçersiz yorum ID formatı."
        )
    
    # Yorumu bul
    existing_review = await db.reviews.find_one({"_id": ObjectId(review_id)})
    if not existing_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Yorum bulunamadı."
        )
    
    # Yorum sahibi mi veya admin mi kontrol et
    is_owner = existing_review["user_id"] == str(current_user["_id"])
    is_admin = current_user.get("role") == "admin"
    
    if not is_owner and not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bu yorumu silme yetkiniz yok."
        )
    
    movie_id = existing_review["movie_id"]
    await db.reviews.delete_one({"_id": ObjectId(review_id)})
    
    # Filmin ortalama puanını güncelle
    await update_movie_average_rating(db, movie_id)
    
    return None
