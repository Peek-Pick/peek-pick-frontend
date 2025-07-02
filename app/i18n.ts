import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 번역 리소스
const resources = {
    en: {
        translation: {
            // 공용
            "postedOn": "Posted on",
            "moreButton": "More",

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
            },

            // 마이페이지
            "myPagePointStore":"Point Store",
            "myPageEditProfile": "Edit Profile",
            "myPageWishlistItems": "Wishlist Items",
            "myPageMyReviews": "My Reviews",
            "myPageCoupons": "Coupons",
            "myPageBarcodeHistory": "Barcode History",
            "myPageLanguageSettings": "Language Settings",
            "myPageSupport": "Support",
            "myPageNotifications": "Notifications",
            "myPagePrivacy Policy": "Privacy Policy",
            "myPageTermsOfService": "Terms of Service",
            "myPageLicenses": "Licenses",
            "myPageDeleteAccount": "Delete Account",
            "myPageLogout": "Logout",
            "languageSelectGuide": "Language Select",
            "selectLanguageConfirm": "Please select a language.",
            "languageChangeSuccess": "Language changed successfully.",

            // 마이페이지 수정
            "myPageEdit": {
                "account": "Account Information",
                "profileInfo": "Profile Information",
                "tags": "Interests / Tags",
                "changePassword": "Change Password",
                "allTags": "View All Tags",
                "selectedTags": "Selected Tags",
                "noTags": "No tags selected.",
                "addTags": "Add Tags ▼",
                "hideTags": "Hide Tags ▲"
            },
            "form": {
                "email": "Email",
                "currentPassword": "Current Password",
                "newPassword": "New Password",
                "checkPassword": "Confirm Password",
                "ifSocial": "Password changes are not available for social accounts.",
                "enterCurrentPassword": "Enter your current password",
                "enterNewPassword": "Enter a new password",
                "enterNewPasswordRe": "Re-enter your new password",
                "passwordCheck": "Verify Password",
                "passwordCheckSuccess": "Password verified successfully.",
                "nickname": "Nickname",
                "nicknameAvailable": "The nickname is available.",
                "checking": "Checking...",
                "gender": "Gender",
                "nationality": "Nationality",
                "birthDate": "Date of Birth",
                "save": "Save"
            },

            // useMyPageEdit
            "updatingProfileSuccess": "Profile updated successfully.",
            "updatingProfileFail": "Failed to update profile.",

            // useAccountDelete
            "deletingUserSuccess": "Your account has been successfully deleted.",
            "deletingUserFail": "Failed to delete account.",
            "deletingUserConfirm": "Are You Sure You Want to Delete Your Account?",
            "deletingUserWarning": "This action is permanent and cannot be undone.",

            // 메인
            "mainBarcode": "Barcode",
            "mainWishList": "WishList",
            "mainEvent": "Event",
            "mainNearbyStores": "Nearby Stores",
            "mainAIChatBot": "AI ChatBot",
            "mainRanking": "Ranking",
            "mainTopRanking": "Top Ranking",
            "mainTopPicksForYou": "Top Picks For You",
            "pleaseLoginToView": "Please log in to view.",
            "goToLogin": "Go to Login",
            "mainBottomHome": "HOME",
            "mainBottomBarcode": "BARCODE",
            "mainBottomSearch": "SEARCH",
        },
    },
    ko: {
        translation: {
            //공용
            "postedOn": "작성일",
            "moreButton": "더보기",

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
            },

            // 마이페이지
            "myPagePointStore":"포인트 상점",
            "myPageEditProfile": "프로필 수정",
            "myPageWishlistItems": "찜한 상품",
            "myPageMyReviews": "내 리뷰",
            "myPageCoupons": "쿠폰함",
            "myPageBarcodeHistory": "바코드 내역",
            "myPageLanguageSettings": "언어 설정",
            "myPageSupport": "문의 사항",
            "myPageNotifications": "알림",
            "myPagePrivacyPolicy": "개인정보 처리방침",
            "myPageTermsOfService": "이용 약관",
            "myPageLicenses": "라이센스",
            "myPageDeleteAccount": "계정 삭제",
            "myPageLogout": "로그아웃",
            "languageSelectGuide": "언어 설정",
            "selectLanguageConfirm": "언어를 선택해 주세요.",
            "languageChangeSuccess": "언어 설정 완료.",

            // 마이페이지 수정
            "myPageEdit": {
                "account": "계정 정보",
                "profileInfo": "프로필 정보",
                "tags": "관심 태그",
                "changePassword": "비밀번호 변경하기",
                "allTags": "모든 태그 보기",
                "selectedTags": "선택된 태그",
                "noTags": "선택된 태그가 없습니다.",
                "addTags": "태그 추가하기 ▼",
                "hideTags": "태그 숨기기 ▲",
            },
            "form": {
                "email": "이메일",
                "currentPassword": "현재 비밀번호",
                "newPassword": "새 비밀번호",
                "checkPassword": "비밀번호 확인",
                "ifSocial": "소셜 로그인은 비밀번호를 변경할 수 없습니다.",
                "enterCurrentPassword": "현재 비밀번호를 입력하세요",
                "enterNewPassword": "새 비밀번호를 입력하세요",
                "enterNewPasswordRe": "새 비밀번호를 다시 입력하세요",
                "passwordCheck": "비밀번호 확인하기",
                "passwordCheckSuccess": "비밀번호가 확인되었습니다.",
                "nickname": "닉네임",
                "nicknameAvailable": "사용 가능한 닉네임입니다.",
                "checking": "확인 중...",
                "gender": "성별",
                "nationality": "국적",
                "birthDate": "생년월일",
                "save": "저장하기"
            },

            // useMyPageEdit
            "updatingProfileSuccess": "프로필 수정 완료.",
            "updatingProfileFail": "프로필 수정 실패.",

            // useAccountDelete
            "deletingUserSuccess": "계정 삭제 완료.",
            "deletingUserFail": "계정 삭제 실패.",
            "deletingUserConfirm": "계정을 삭제하시겠습니까?",
            "deletingUserWarning": "삭제하면 되돌릴 수 없습니다.",

            // 메인
            "mainBarcode": "바코드",
            "mainWishList": "찜한 상품",
            "mainEvent": "공지사항",
            "mainNearbyStores": "편의점 찾기",
            "mainAIChatBot": "AI 챗봇",
            "mainRanking": "랭킹",
            "mainTopRanking": "랭킹 상품",
            "mainTopPicksForYou": "추천 상품",
            "pleaseLoginToView": "로그인 후 확인 가능합니다.",
            "goToLogin": "로그인하러 가기",
            "mainBottomHome": "홈",
            "mainBottomBarcode": "바코드",
            "mainBottomSearch": "검색",
        },
    },
    ja: {
        translation: {
            "postedOn": "投稿日",
            "moreButton": "もっと見る",

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
            },

            // 마이페이지
            "myPagePointStore": "ストア",
            "myPageEditProfile": "編集",
            "myPageWishlistItems": "お気に入り",
            "myPageMyReviews": "マイレビュー",
            "myPageCoupons": "クーポン",
            "myPageBarcodeHistory": "バーコード履歴",
            "myPageLanguageSettings": "言語設定",
            "myPageSupport": "お問い合わせ",
            "myPageNotifications": "通知",
            "myPagePrivacyPolicy": "プライバシーポリシー",
            "myPageTermsOfService": "利用規約",
            "myPageLicenses": "ライセンス",
            "myPageDeleteAccount": "アカウント削除",
            "myPageLogout": "ログアウト",
            "languageSelectGuide": "言語設定",
            "selectLanguageConfirm": "言語を選択してください。",
            "languageChangeSuccess": "言語が変更されました。",


            // 마이페이지 수정
            "myPageEdit": {
                "account": "アカウント情報",
                "profileInfo": "プロフィール情報",
                "tags": "興味・タグ",
                "changePassword": "パスワードを変更する",
                "allTags": "すべてのタグを見る",
                "selectedTags": "選択されたタグ",
                "noTags": "タグが選択されていません。",
                "addTags": "タグを追加する ▼",
                "hideTags": "タグを隠す ▲"
            },
            "form": {
                "email": "メールアドレス",
                "currentPassword": "現在のパスワード",
                "newPassword": "新しいパスワード",
                "checkPassword": "パスワード確認",
                "ifSocial": "ソーシャルログインではパスワードを変更できません。",
                "enterCurrentPassword": "現在のパスワードを入力してください",
                "enterNewPassword": "新しいパスワードを入力してください",
                "enterNewPasswordRe": "新しいパスワードを再入力してください",
                "passwordCheck": "パスワードを確認する",
                "passwordCheckSuccess": "パスワードが確認されました。",
                "nickname": "ニックネーム",
                "nicknameAvailable": "使用可能なニックネームです。",
                "checking": "確認中...",
                "gender": "性別",
                "nationality": "国籍",
                "birthDate": "生年月日",
                "save": "保存する"
            },

            // useMyPageEdit
            "updatingProfileSuccess": "プロフィールを更新しました。",
            "updatingProfileFail": "プロフィールの更新に失敗しました。",

            // useAccountDelete
            "deletingUserSuccess": "アカウントを削除しました。",
            "deletingUserFail": "アカウントの削除に失敗しました。",
            "deletingUserConfirm": "アカウントを削除しますか？",
            "deletingUserWarning": "削除すると元に戻せません。",

            // 메인
            "mainBarcode": "コード",
            "mainWishList": "お気に入り",
            "mainEvent": "イベント",
            "mainNearbyStores": "近く",
            "mainAIChatBot": "AIチャット",
            "mainRanking": "ランク",
            "mainTopRanking": "人気商品",
            "mainTopPicksForYou": "おすすめ商品",
            "pleaseLoginToView": "ログイン後に表示されます.",
            "goToLogin": "ログインページへ",
            "mainBottomHome": "ホーム",
            "mainBottomBarcode": "バーコード",
            "mainBottomSearch": "検索"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en', // 기본 언어
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;