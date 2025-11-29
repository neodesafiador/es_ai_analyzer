from sqlalchemy import Column, Integer, String, Text, Float, DateTime, JSON
from sqlalchemy.sql import func
from .database import Base


class ESEntry(Base):
    """ESエントリのデータベースモデル"""
    __tablename__ = "es_entries"

    id = Column(Integer, primary_key=True, index=True)
    question_type = Column(String(100), nullable=False)  # 例：ガクチカ、志望動機
    question_text = Column(Text, nullable=False)  # 設問の内容
    content = Column(Text, nullable=False)  # ES本文
    word_count = Column(Integer, nullable=False)  # 文字数
    company_name = Column(String(200), nullable=True)  # 企業名（任意）
    industry = Column(String(100), nullable=True)  # 業界（任意）
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class ESAnalysis(Base):
    """ES分析結果のデータベースモデル"""
    __tablename__ = "es_analyses"

    id = Column(Integer, primary_key=True, index=True)
    es_entry_id = Column(Integer, nullable=False, index=True)  # 外部キー

    # スコア
    logic_score = Column(Float, nullable=False)  # 論理性スコア (0-100)
    specificity_score = Column(Float, nullable=False)  # 具体性スコア (0-100)
    readability_score = Column(Float, nullable=False)  # 読みやすさスコア (0-100)
    consistency_score = Column(Float, nullable=True)  # 業界一貫性スコア (0-100)

    # 構造分析
    structure_type = Column(String(50), nullable=True)  # 例：PREP, STAR, その他
    structure_evaluation = Column(Text, nullable=True)  # 構造の評価コメント

    # 改善提案
    improvement_points = Column(JSON, nullable=True)  # 改善ポイントの配列
    improved_content = Column(Text, nullable=False)  # 改善後のES全文

    # メタデータ
    created_at = Column(DateTime(timezone=True), server_default=func.now())
