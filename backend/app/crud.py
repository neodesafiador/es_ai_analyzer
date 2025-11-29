from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from . import models, schemas


def create_es_entry(db: Session, es_entry: schemas.ESEntryCreate) -> models.ESEntry:
    """ESエントリを作成"""
    db_entry = models.ESEntry(**es_entry.model_dump())
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


def get_es_entry(db: Session, entry_id: int) -> Optional[models.ESEntry]:
    """ESエントリを取得"""
    return db.query(models.ESEntry).filter(models.ESEntry.id == entry_id).first()


def get_es_entries(db: Session, skip: int = 0, limit: int = 100) -> List[models.ESEntry]:
    """ESエントリの一覧を取得（新しい順）"""
    return db.query(models.ESEntry).order_by(desc(models.ESEntry.created_at)).offset(skip).limit(limit).all()


def create_es_analysis(db: Session, analysis: schemas.ESAnalysisCreate) -> models.ESAnalysis:
    """ES分析結果を作成"""
    db_analysis = models.ESAnalysis(**analysis.model_dump())
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)
    return db_analysis


def get_es_analysis_by_entry_id(db: Session, entry_id: int) -> Optional[models.ESAnalysis]:
    """ESエントリIDから分析結果を取得"""
    return db.query(models.ESAnalysis).filter(models.ESAnalysis.es_entry_id == entry_id).first()


def get_es_history(db: Session, skip: int = 0, limit: int = 50) -> List[dict]:
    """ES履歴を取得（エントリと分析結果を結合）"""
    results = (
        db.query(
            models.ESEntry.id,
            models.ESEntry.question_type,
            models.ESEntry.company_name,
            models.ESEntry.industry,
            models.ESEntry.created_at,
            models.ESAnalysis.logic_score,
            models.ESAnalysis.specificity_score,
            models.ESAnalysis.readability_score,
        )
        .join(models.ESAnalysis, models.ESEntry.id == models.ESAnalysis.es_entry_id)
        .order_by(desc(models.ESEntry.created_at))
        .offset(skip)
        .limit(limit)
        .all()
    )

    return [
        {
            "id": r.id,
            "question_type": r.question_type,
            "company_name": r.company_name,
            "industry": r.industry,
            "created_at": r.created_at,
            "logic_score": r.logic_score,
            "specificity_score": r.specificity_score,
            "readability_score": r.readability_score,
        }
        for r in results
    ]
