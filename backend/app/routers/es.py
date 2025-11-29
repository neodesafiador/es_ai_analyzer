from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db
from ..services.es_analyzer import ESAnalyzerService

router = APIRouter(prefix="/api/es", tags=["es"])


@router.post("/analyze", response_model=schemas.ESAnalyzeResponse, status_code=201)
async def analyze_es(
    request: schemas.ESAnalyzeRequest,
    db: Session = Depends(get_db)
):
    """
    ESを分析する（新規作成）

    1. ESエントリをDBに保存
    2. OpenAI APIで分析
    3. 分析結果をDBに保存
    4. 両方を返す
    """
    try:
        # 1. ESエントリを作成
        es_entry = crud.create_es_entry(db, request)

        # 2. AI分析を実行
        analyzer = ESAnalyzerService()
        analysis_result = analyzer.analyze_es(
            question_type=request.question_type,
            question_text=request.question_text,
            content=request.content,
            company_name=request.company_name,
            industry=request.industry,
        )

        # 3. 分析結果を保存
        analysis_create = schemas.ESAnalysisCreate(
            es_entry_id=es_entry.id,
            **analysis_result
        )
        analysis = crud.create_es_analysis(db, analysis_create)

        # 4. レスポンスを返す
        return schemas.ESAnalyzeResponse(
            es_entry=es_entry,
            analysis=analysis
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history", response_model=List[schemas.ESHistoryItem])
async def get_history(
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """ES履歴を取得（一覧表示用）"""
    return crud.get_es_history(db, skip=skip, limit=limit)


@router.get("/{entry_id}", response_model=schemas.ESAnalyzeResponse)
async def get_es_detail(
    entry_id: int,
    db: Session = Depends(get_db)
):
    """ESの詳細を取得（エントリ + 分析結果）"""
    # ESエントリを取得
    es_entry = crud.get_es_entry(db, entry_id)
    if not es_entry:
        raise HTTPException(status_code=404, detail="ESエントリが見つかりません")

    # 分析結果を取得
    analysis = crud.get_es_analysis_by_entry_id(db, entry_id)
    if not analysis:
        raise HTTPException(status_code=404, detail="分析結果が見つかりません")

    return schemas.ESAnalyzeResponse(
        es_entry=es_entry,
        analysis=analysis
    )


@router.get("/", response_model=List[schemas.ESEntryResponse])
async def get_es_list(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """ESエントリの一覧を取得"""
    return crud.get_es_entries(db, skip=skip, limit=limit)
