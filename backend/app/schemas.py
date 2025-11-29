from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ESエントリのスキーマ
class ESEntryBase(BaseModel):
    question_type: str = Field(..., description="設問タイプ（例：ガクチカ、志望動機）")
    question_text: str = Field(..., description="設問の内容")
    content: str = Field(..., description="ES本文")
    word_count: int = Field(..., ge=0, description="文字数")
    company_name: Optional[str] = Field(None, description="企業名")
    industry: Optional[str] = Field(None, description="業界")


class ESEntryCreate(ESEntryBase):
    pass


class ESEntryResponse(ESEntryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ES分析結果のスキーマ
class ESAnalysisBase(BaseModel):
    logic_score: float = Field(..., ge=0, le=100, description="論理性スコア")
    specificity_score: float = Field(..., ge=0, le=100, description="具体性スコア")
    readability_score: float = Field(..., ge=0, le=100, description="読みやすさスコア")
    consistency_score: Optional[float] = Field(None, ge=0, le=100, description="業界一貫性スコア")
    structure_type: Optional[str] = Field(None, description="文章構造タイプ")
    structure_evaluation: Optional[str] = Field(None, description="構造の評価")
    improvement_points: Optional[List[str]] = Field(None, description="改善ポイント")
    improved_content: str = Field(..., description="改善後のES全文")


class ESAnalysisCreate(ESAnalysisBase):
    es_entry_id: int


class ESAnalysisResponse(ESAnalysisBase):
    id: int
    es_entry_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# 分析リクエスト（ESエントリと同時作成）
class ESAnalyzeRequest(ESEntryBase):
    pass


# 分析レスポンス（ESエントリと分析結果を含む）
class ESAnalyzeResponse(BaseModel):
    es_entry: ESEntryResponse
    analysis: ESAnalysisResponse

    class Config:
        from_attributes = True


# 履歴取得用のレスポンス
class ESHistoryItem(BaseModel):
    id: int
    question_type: str
    company_name: Optional[str]
    industry: Optional[str]
    logic_score: float
    specificity_score: float
    readability_score: float
    created_at: datetime

    class Config:
        from_attributes = True
