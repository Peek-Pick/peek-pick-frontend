import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 번역 리소스
const resources = {
    US: {
        translation: {
            // 공용
            "postedOn": "Posted on",

            //swal 공용
            "confirmOKButtonText": "OK",
            "confirmUpdateButtonText": "Update",
            "confirmDeleteButtonText": "Delete",
            "cancelButtonText": "Cancel",

            // 리뷰
            "reviewLoading": "Loading...",
            "reviewLoadError": "Failed to load review data.",
            "reviewEmptyError": "No reviews have been written yet.",
            "submittingReview": "Submitting review...",
            "submittingReviewSuccess": "Review submitted successfully.",
            "submittingReviewFail": "Failed to submit review.",
            "submittingReviewCheck": "Please enter your review.",
            "reviewAddGuide": "How did you like the product?",
            "reviewCommentGuide": "Please leave an honest product review.",
            "tagSelectGuide": "Select Tags",
            "addPhotoGuide": "Add Photo",
            "submittingReviewButton": "Submit Review",
            "submittingReviewButtonPending": "Registering...",
            "updatingReview": "Updating review...",
            "updatingReviewSuccess": "Review updated successfully.",
            "updatingReviewFail": "Failed to update review.",
            "updatingReviewConfirm": "Are you sure you want to update your review?",
            "updatingReviewWarning": "Once updated, the changes cannot be undone.",
            "deleteReviewConfirm": "Are you sure you want to delete this review?",
            "deleteReviewWarning": "Once deleted, the changes cannot be undone.",
            "deletingReview": "Deleting review...",
            "deletingReviewSuccess": "Review deleted successfully.",
            "deletingReviewFail": "Failed to delete review.",
            "editPhotoGuide": "Edit Photo",
            "updateReviewButton": "Update Review",
            "deleteReviewButton": "Delete Review",
            "detailReviewButton": "View Detail",
            "totalReview": "total Reviews",
            "reportReview": "report",
            "viewAll": "View All",
            "translateOriginalButton": "Original",
            "translateButton": "Translate",
            "translatingReview": "Translating the review...",
            "hiddenReviewGuide": "This review is hidden!",
            "hiddenReviewShowButton": "Show Anyway",
            "sortReviewLatest": "Latest",
            "sortReviewLike": "Most Liked",

            // 리뷰 요약
            "aiSummaryTitle": "AI Summarized It!",
            "positiveReview": "Positive Review",
            "negativeReview": "Negative Review",

            // 리뷰 신고
            "reportReasons": {
                "POLITICS": "Political content",
                "HATE": "Hate speech",
                "DEFAMATION": "Defamation",
                "PROFANITY": "Inappropriate language"
            },
            "submittingReport": "Submitting report...",
            "submittingReportSuccess": "Report submitted successfully.",
            "submittingReportFail": "You have already reported this review.",
            "selectReportReason": "Select a reason for reporting",
            "selectReportReasonConfirm": "Please select a reason.",
            "submittingReportButton": "Submit Report",
            "likeReview": "like",
            "ratings": "Ratings",

            // 상품
            "productLoadError": "Failed to load product data.",

            //태그
            "tags": {
                "SWEET": "SWEET",
                "SAVORY": "SAVORY",
                "SPICY": "SPICY",
                "NUTTY": "NUTTY",
                "MILD": "MILD",
                "BITTER": "BITTER",
                "SOUR": "SOUR",
                "CRISPY": "CRISPY",
                "CHEWY": "CHEWY",
                "MOIST": "MOIST",
                "SOFT": "SOFT",
                "TOUGH": "TOUGH",
                "DRY": "DRY",
                "BUTTERY": "BUTTERY",
                "CHEESY": "CHEESY",
                "GARLICKY": "GARLICKY",
                "SMOKY": "SMOKY",
                "RICH": "RICH",
                "CLEAN": "CLEAN",
                "FILLING": "FILLING",
                "ADDICTIVE": "ADDICTIVE",
                "GREASY": "GREASY",
                "LOW_CALORIE": "LOW CALORIE",
                "HIGH_PROTEIN": "HIGH PROTEIN",
                "LOW_SUGAR": "LOW SUGAR",
                "VEGETARIAN": "VEGETARIAN",
                "VEGAN": "VEGAN",
                "GLUTEN_FREE": "GLUTEN FREE"
            },
            "categories": {
                "TASTE": "TASTE",
                "TEXTURE": "TEXTURE",
                "FLAVOR": "FLAVOR",
                "OTHER": "OTHER",
                "HEALTH": "HEALTH"
            }
        },
    },
    KR: {
        translation: {
            //공용
            "postedOn": "작성일",

            //swal 공용
            "confirmOKButtonText": "확인",
            "confirmUpdateButtonText": "수정",
            "confirmDeleteButtonText": "삭제",
            "cancelButtonText": "취소",

            // 리뷰
            "reviewLoading": "로딩중...",
            "reviewLoadError": "리뷰 정보를 가져오지 못했습니다.",
            "reviewEmptyError": "아직 작성된 리뷰가 없습니다.",
            "submittingReview": "리뷰 작성 중...",
            "submittingReviewSuccess": "리뷰 작성 완료.",
            "submittingReviewFail": "리뷰 작성 실패.",
            "submittingReviewCheck": "리뷰를 작성해주세요.",
            "reviewAddGuide": "상품은 어떠셨나요?",
            "reviewCommentGuide": "상품에 대한 솔직한 리뷰를 남겨주세요.",
            "tagSelectGuide": "태그 선택",
            "addPhotoGuide": "사진 추가",
            "submittingReviewButton": "리뷰 제출",
            "submittingReviewButtonPending": "작성 중...",
            "updatingReview": "리뷰 수정 중...",
            "updatingReviewSuccess": "리뷰 수정 완료.",
            "updatingReviewFail": "리뷰 수정 실패.",
            "updatingReviewConfirm": "리뷰를 수정하시겠습니까?",
            "updatingReviewWarning": "수정하면 되돌릴 수 없습니다.",
            "deleteReviewConfirm": "리뷰를 삭제하시겠습니까?",
            "deleteReviewWarning": "삭제하면 되돌릴 수 없습니다.",
            "deletingReview": "리뷰 삭제 중...",
            "deletingReviewSuccess": "리뷰 삭제 완료.",
            "deletingReviewFail": "리뷰 삭제 실패.",
            "editPhotoGuide": "사진 수정",
            "updateReviewButton": "리뷰 수정",
            "deleteReviewButton": "리뷰 삭제",
            "detailReviewButton": "상세 보기",
            "totalReview": "전체 리뷰",
            "reportReview": "신고하기",
            "likeReview": "좋아요",
            "ratings": "개의 평가",
            "viewAll": "전체보기",
            "translateOriginalButton": "원문보기",
            "translateButton": "번역하기",
            "translatingReview": "리뷰 번역 중...",
            "hiddenReviewGuide": "숨겨진 리뷰입니다!",
            "hiddenReviewShowButton": "그래도 보기",
            "sortReviewLatest": "최신순",
            "sortReviewLike": "좋아요순",

            // 리뷰 신고
            "reportReasons": {
                "POLITICS": "정치적인 내용",
                "HATE": "혐오 발언",
                "DEFAMATION": "명예 훼손",
                "PROFANITY": "부적절한 언어"
            },
            "submittingReport": "리뷰 신고 중.",
            "submittingReportSuccess": "리뷰 신고 완료.",
            "submittingReportFail": "리뷰 신고 실패.",
            "selectReportReason": "사유를 선택해주세요",
            "selectReportReasonConfirm": "신고 사유를 선택해야 합니다.",
            "submittingReportButton": "리뷰 신고하기",

            // 리뷰 요약
            "aiSummaryTitle": "AI가 요약했어요!",
            "positiveReview": "긍정 반응",
            "negativeReview": "부정 반응",

            // 상품
            "productLoadError": "상품 정보를 가져오지 못했습니다.",

            //태그
            "tags": {
                "SWEET": "달콤한",
                "SAVORY": "짭짤한",
                "SPICY": "매운",
                "NUTTY": "고소한",
                "MILD": "순한",
                "BITTER": "쓴",
                "SOUR": "신",
                "CRISPY": "바삭한",
                "CHEWY": "쫄깃한",
                "MOIST": "촉촉한",
                "SOFT": "부드러운",
                "TOUGH": "질긴",
                "DRY": "건조한",
                "BUTTERY": "버터 풍미",
                "CHEESY": "치즈 풍미",
                "GARLICKY": "마늘 풍미",
                "SMOKY": "훈제 풍미",
                "RICH": "풍부한",
                "CLEAN": "깔끔한",
                "FILLING": "든든한",
                "ADDICTIVE": "중독성 있는",
                "GREASY": "기름진",
                "LOW_CALORIE": "저칼로리",
                "HIGH_PROTEIN": "고단백",
                "LOW_SUGAR": "저당",
                "VEGETARIAN": "채식",
                "VEGAN": "비건",
                "GLUTEN_FREE": "글루텐 프리"
            },
            "categories": {
                "TASTE": "맛",
                "TEXTURE": "식감",
                "FLAVOR": "풍미",
                "OTHER": "기타",
                "HEALTH": "건강"
            }
        },
    },
    JP: {
        translation: {
            "postedOn": "投稿日",

            "confirmOKButtonText": "確認",
            "confirmUpdateButtonText": "更新",
            "confirmDeleteButtonText": "削除",
            "cancelButtonText": "キャンセル",

            "reviewLoading": "読み込み中...",
            "reviewLoadError": "レビューの読み込みに失敗しました。",
            "reviewEmptyError": "まだレビューがありません。",
            "submittingReview": "レビューを送信中...",
            "submittingReviewSuccess": "レビューが正常に送信されました。",
            "submittingReviewFail": "レビューの送信に失敗しました。",
            "submittingReviewCheck": "レビューを入力してください。",
            "reviewAddGuide": "この商品はいかがでしたか？",
            "reviewCommentGuide": "正直なレビューをお書きください。",
            "tagSelectGuide": "タグを選択",
            "addPhotoGuide": "写真を追加",
            "submittingReviewButton": "レビューを送信",
            "submittingReviewButtonPending": "登録中...",
            "updatingReview": "レビューを更新中...",
            "updatingReviewSuccess": "レビューが更新されました。",
            "updatingReviewFail": "レビューの更新に失敗しました。",
            "updatingReviewConfirm": "このレビューを更新してもよろしいですか？",
            "updatingReviewWarning": "更新後は元に戻せません。",
            "deleteReviewConfirm": "このレビューを削除してもよろしいですか？",
            "deleteReviewWarning": "削除後は元に戻せません。",
            "deletingReview": "レビューを削除中...",
            "deletingReviewSuccess": "レビューが削除されました。",
            "deletingReviewFail": "レビューの削除に失敗しました。",
            "editPhotoGuide": "写真を編集",
            "updateReviewButton": "レビューを更新",
            "deleteReviewButton": "レビューを削除",
            "detailReviewButton": "詳細を見る",
            "totalReview": "合計レビュー数",
            "reportReview": "通報",
            "viewAll": "すべて見る",
            "translateOriginalButton": "原文",
            "translateButton": "翻訳",
            "translatingReview": "レビューを翻訳中...",
            "hiddenReviewGuide": "このレビューは非表示です！",
            "hiddenReviewShowButton": "表示する",
            "sortReviewLatest": "最新",
            "sortReviewLike": "人気順",

            "aiSummaryTitle": "AIによる要約",
            "positiveReview": "ポジティブレビュー",
            "negativeReview": "ネガティブレビュー",

            "reportReasons": {
                "POLITICS": "政治的な内容",
                "HATE": "ヘイトスピーチ",
                "DEFAMATION": "名誉毀損",
                "PROFANITY": "不適切な言葉"
            },
            "submittingReport": "通報を送信中...",
            "submittingReportSuccess": "通報が正常に送信されました。",
            "submittingReportFail": "このレビューは既に通報済みです。",
            "selectReportReason": "通報理由を選択",
            "selectReportReasonConfirm": "理由を選択してください。",
            "submittingReportButton": "通報を送信",
            "likeReview": "いいね",
            "ratings": "評価",

            "productLoadError": "商品の読み込みに失敗しました。",

            "tags": {
                "SWEET": "甘い",
                "SAVORY": "旨味",
                "SPICY": "辛い",
                "NUTTY": "ナッツ風味",
                "MILD": "マイルド",
                "BITTER": "苦い",
                "SOUR": "酸っぱい",
                "CRISPY": "サクサク",
                "CHEWY": "もちもち",
                "MOIST": "しっとり",
                "SOFT": "やわらかい",
                "TOUGH": "かたい",
                "DRY": "乾燥",
                "BUTTERY": "バター風味",
                "CHEESY": "チーズ風味",
                "GARLICKY": "ニンニク風味",
                "SMOKY": "スモーキー",
                "RICH": "濃厚",
                "CLEAN": "さっぱり",
                "FILLING": "食べ応えあり",
                "ADDICTIVE": "やみつき",
                "GREASY": "脂っこい",
                "LOW_CALORIE": "低カロリー",
                "HIGH_PROTEIN": "高たんぱく",
                "LOW_SUGAR": "低糖質",
                "VEGETARIAN": "ベジタリアン",
                "VEGAN": "ビーガン",
                "GLUTEN_FREE": "グルテンフリー"
            },
            "categories": {
                "TASTE": "味",
                "TEXTURE": "食感",
                "FLAVOR": "風味",
                "OTHER": "その他",
                "HEALTH": "健康"
            }
        }
    },
    CN: {
        translation: {
            "postedOn": "发表于",

            "confirmOKButtonText": "确认",
            "confirmUpdateButtonText": "更新",
            "confirmDeleteButtonText": "删除",
            "cancelButtonText": "取消",

            "reviewLoading": "加载中...",
            "reviewLoadError": "加载评论数据失败。",
            "reviewEmptyError": "尚未有评论。",
            "submittingReview": "提交评论中...",
            "submittingReviewSuccess": "评论提交成功。",
            "submittingReviewFail": "评论提交失败。",
            "submittingReviewCheck": "请输入评论内容。",
            "reviewAddGuide": "您觉得这款产品怎么样？",
            "reviewCommentGuide": "请留下真实的产品评价。",
            "tagSelectGuide": "选择标签",
            "addPhotoGuide": "添加照片",
            "submittingReviewButton": "提交评论",
            "submittingReviewButtonPending": "提交中...",
            "updatingReview": "更新评论中...",
            "updatingReviewSuccess": "评论更新成功。",
            "updatingReviewFail": "评论更新失败。",
            "updatingReviewConfirm": "确定要更新此评论吗？",
            "updatingReviewWarning": "更新后无法恢复原内容。",
            "deleteReviewConfirm": "确定要删除此评论吗？",
            "deleteReviewWarning": "删除后无法恢复。",
            "deletingReview": "删除评论中...",
            "deletingReviewSuccess": "评论删除成功。",
            "deletingReviewFail": "评论删除失败。",
            "editPhotoGuide": "编辑照片",
            "updateReviewButton": "更新评论",
            "deleteReviewButton": "删除评论",
            "detailReviewButton": "查看详情",
            "totalReview": "总评论数",
            "reportReview": "举报",
            "viewAll": "查看全部",
            "translateOriginalButton": "原文",
            "translateButton": "翻译",
            "translatingReview": "评论翻译中...",
            "hiddenReviewGuide": "此评论已隐藏！",
            "hiddenReviewShowButton": "仍要查看",
            "sortReviewLatest": "最新",
            "sortReviewLike": "点赞最多",

            "aiSummaryTitle": "AI总结内容",
            "positiveReview": "正面评论",
            "negativeReview": "负面评论",

            "reportReasons": {
                "POLITICS": "政治内容",
                "HATE": "仇恨言论",
                "DEFAMATION": "诽谤",
                "PROFANITY": "不当言论"
            },
            "submittingReport": "提交举报中...",
            "submittingReportSuccess": "举报提交成功。",
            "submittingReportFail": "您已举报过此评论。",
            "selectReportReason": "请选择举报原因",
            "selectReportReasonConfirm": "请选择一个理由。",
            "submittingReportButton": "提交举报",
            "likeReview": "点赞",
            "ratings": "评分",

            "productLoadError": "加载商品数据失败。",

            "tags": {
                "SWEET": "甜",
                "SAVORY": "鲜",
                "SPICY": "辣",
                "NUTTY": "坚果味",
                "MILD": "清淡",
                "BITTER": "苦",
                "SOUR": "酸",
                "CRISPY": "酥脆",
                "CHEWY": "有嚼劲",
                "MOIST": "湿润",
                "SOFT": "柔软",
                "TOUGH": "硬",
                "DRY": "干燥",
                "BUTTERY": "黄油味",
                "CHEESY": "奶酪味",
                "GARLICKY": "蒜香味",
                "SMOKY": "烟熏味",
                "RICH": "浓郁",
                "CLEAN": "清爽",
                "FILLING": "饱腹感",
                "ADDICTIVE": "让人上瘾",
                "GREASY": "油腻",
                "LOW_CALORIE": "低热量",
                "HIGH_PROTEIN": "高蛋白",
                "LOW_SUGAR": "低糖",
                "VEGETARIAN": "素食",
                "VEGAN": "纯素",
                "GLUTEN_FREE": "无麸质"
            },
            "categories": {
                "TASTE": "味道",
                "TEXTURE": "口感",
                "FLAVOR": "风味",
                "OTHER": "其他",
                "HEALTH": "健康"
            }
        }
    },
    // ES, VN, TH, PH도 동일하게 `translation` 키를 채워주세요
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'KR', // 기본 언어
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;