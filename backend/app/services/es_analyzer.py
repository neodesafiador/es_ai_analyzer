import json
from openai import OpenAI
from typing import Dict, Any, Optional
from ..database import get_settings


class ESAnalyzerService:
    """OpenAI GPTを使ったES分析サービス"""

    # 業界別の評価基準とキーワード
    INDUSTRY_PROFILES = {
        "コンサルティング": {
            "key_points": ["論理的思考力", "問題解決能力", "フレームワーク活用", "定量的分析", "仮説検証"],
            "frameworks": ["PREP法", "ロジックツリー", "MECE", "因果関係の明確化"],
            "tone": "簡潔で論理的、ビジネスライク",
            "keywords": ["課題", "分析", "仮説", "検証", "成果", "インパクト", "Why", "How"]
        },
        "IT・エンジニア": {
            "key_points": ["技術力", "問題解決", "学習意欲", "チーム開発", "アウトプット"],
            "frameworks": ["STAR法", "課題→アプローチ→実装→結果"],
            "tone": "具体的で技術的、プロセス重視",
            "keywords": ["技術", "開発", "実装", "最適化", "改善", "効率化", "GitHub", "チーム"]
        },
        "商社": {
            "key_points": ["行動力", "コミュニケーション力", "グローバル志向", "交渉力", "粘り強さ"],
            "frameworks": ["STAR法", "状況→行動→結果"],
            "tone": "エネルギッシュで人間味がある",
            "keywords": ["挑戦", "巻き込み", "働きかけ", "達成", "粘り強く", "関係構築", "海外", "多様性"]
        },
        "メガベンチャー": {
            "key_points": ["主体性", "スピード感", "成長意欲", "変化対応力", "当事者意識"],
            "frameworks": ["STAR法", "チャレンジと成長"],
            "tone": "前向きで主体的、成長志向",
            "keywords": ["主体的", "0→1", "スピード", "成長", "挑戦", "変化", "自ら", "圧倒的"]
        },
        "金融": {
            "key_points": ["正確性", "誠実性", "数字への強さ", "リスク管理", "責任感"],
            "frameworks": ["PREP法", "事実ベース"],
            "tone": "誠実で堅実、正確性重視",
            "keywords": ["正確", "責任", "信頼", "数字", "分析", "リスク", "慎重", "誠実"]
        },
        "メーカー": {
            "key_points": ["ものづくり志向", "改善意識", "協調性", "粘り強さ", "品質意識"],
            "frameworks": ["STAR法", "課題→改善→結果"],
            "tone": "堅実で協調的、プロセス重視",
            "keywords": ["改善", "品質", "工夫", "チーム", "粘り強く", "ものづくり", "最適化"]
        }
    }

    def __init__(self):
        settings = get_settings()
        self.client = OpenAI(api_key=settings.openai_api_key)
        self.model = "gpt-4o-mini"

    def analyze_es(
        self,
        question_type: str,
        question_text: str,
        content: str,
        company_name: str = None,
        industry: str = None,
    ) -> Dict[str, Any]:
        """
        ESを分析して、スコア、構造評価、改善案を生成する

        Returns:
            {
                'logic_score': float,
                'specificity_score': float,
                'readability_score': float,
                'consistency_score': float,
                'structure_type': str,
                'structure_evaluation': str,
                'improvement_points': List[str],
                'improved_content': str
            }
        """

        # プロンプトの構築
        system_prompt = self._build_system_prompt(industry)
        user_prompt = self._build_user_prompt(
            question_type, question_text, content, company_name, industry
        )

        try:
            # OpenAI APIを呼び出し
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.7,
            )

            # レスポンスをパース
            result = json.loads(response.choices[0].message.content)
            return self._format_result(result)

        except Exception as e:
            raise Exception(f"ES分析中にエラーが発生しました: {str(e)}")

    def _build_system_prompt(self, industry: Optional[str] = None) -> str:
        """システムプロンプトの構築（業界別最適化）"""

        base_prompt = """あなたは就活生のエントリーシート（ES）を分析し、改善提案を行う専門家です。

以下の観点でESを分析してください：

1. **論理性スコア (0-100)**: 主張と根拠が明確に結びついているか、論理展開に飛躍がないか
2. **具体性スコア (0-100)**: 具体的な数字、固有名詞、エピソードが含まれているか
3. **読みやすさスコア (0-100)**: 文章の長さ、接続詞の使い方、一文一義が守られているか
4. **業界一貫性スコア (0-100)**: 企業・業界が指定されている場合、その特性と一貫性があるか
5. **文章構造**: PREP法、STAR法などの構造が使われているか
6. **改善ポイント**: 箇条書きで3〜5点の具体的な改善提案
7. **改善版ES**: 上記の分析に基づいた改善版の全文
"""

        # 業界別の追加指示
        if industry and industry in self.INDUSTRY_PROFILES:
            profile = self.INDUSTRY_PROFILES[industry]
            industry_prompt = f"""
## 【{industry}業界向け特別評価基準】

この業界では以下の点を特に重視します：

**重視されるポイント:**
{', '.join(profile['key_points'])}

**推奨される文章構造:**
{', '.join(profile['frameworks'])}

**求められる文章のトーン:**
{profile['tone']}

**効果的なキーワード例:**
{', '.join(profile['keywords'])}

**改善版ESの作成時の注意点:**
- {industry}業界で評価される表現を積極的に使用してください
- 業界特有の価値観や文化に合った表現に調整してください
- 上記のキーワードを自然に組み込んでください
- {profile['frameworks'][0]}の構造を明確にしてください
"""
            base_prompt += industry_prompt

        base_prompt += """

必ずJSON形式で以下の構造で返してください：
{
  "logic_score": 85,
  "specificity_score": 70,
  "readability_score": 80,
  "consistency_score": 75,
  "structure_type": "PREP",
  "structure_evaluation": "PREP法の構造は守られているが...",
  "improvement_points": ["ポイント1", "ポイント2", "ポイント3"],
  "improved_content": "改善後のES全文"
}"""

        return base_prompt

    def _build_user_prompt(
        self,
        question_type: str,
        question_text: str,
        content: str,
        company_name: str = None,
        industry: str = None,
    ) -> str:
        """ユーザープロンプトの構築"""
        prompt = f"""以下のESを分析してください。

【設問タイプ】: {question_type}
【設問内容】: {question_text}
【ES本文】:
{content}
"""
        if company_name:
            prompt += f"\n【企業名】: {company_name}"
        if industry:
            prompt += f"\n【業界】: {industry}"

        prompt += "\n\n上記のESを分析し、JSON形式で結果を返してください。"
        return prompt

    def _format_result(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """結果のフォーマット調整"""
        return {
            "logic_score": float(result.get("logic_score", 0)),
            "specificity_score": float(result.get("specificity_score", 0)),
            "readability_score": float(result.get("readability_score", 0)),
            "consistency_score": float(result.get("consistency_score", 0)) if result.get("consistency_score") else None,
            "structure_type": result.get("structure_type", "不明"),
            "structure_evaluation": result.get("structure_evaluation", ""),
            "improvement_points": result.get("improvement_points", []),
            "improved_content": result.get("improved_content", ""),
        }
