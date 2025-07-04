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

            "productRanking":"Product Ranking",
            "productSearch":"Product Search",
            "recommendedProduct":"Recommended Products",

            "sortProductLike": "Liked",
            "sortProductScore": "Rated",
            "sortProductMatch": "Match",
            "searchBarPlaceholder": "Search product name",

            "productCategory": {
                "0": "All",
                "1": "Snacks",
                "2": "Kimbap/Onigiri",
                "3": "Noodles",
                "4": "Bread/Dessert",
                "5": "Ice Cream",
                "6": "Candy/Gum",
                "7": "Drinks",
                "8": "Sandwich/Burger",
                "9": "Lunch Box",
                "10": "Fruit/Salad",
                "11": "Ready-to-Eat",
                "12": "Instant to Cook",
                "13": "Ingredients",
                "14": "Health Food",
                "15": "Other"
            },



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

            // 바코드 스캔
            "barcodeScanner": {
                "cameraPermissionRequired": "Camera access permission is required.",
                "cameraPermissionTitle": "Camera Permission Required",
                "cameraPermissionText": "Please allow camera access to scan barcodes in Peek&Pick.",
                "cameraAccessFailedTitle": "Camera Access Failed",
                "cameraAccessFailedText": "Camera permission is required.",
                "barcodeProcessFailedTitle": "Barcode Processing Failed",
                "barcodeProcessFailedText": "There was a problem processing the barcode.",
                "confirmButton": "OK"
            },

            // 바코드 히스토리
            "barcodeHistory": {
                "title": "Recent Barcode History",
                "noHistory": "No barcode history found.",
                "reviewAlready": "Review already submitted",
                "writeReview": "Write a Review",
                "footerNote": "Your recent barcode scans are automatically stored in history, with a maximum of 20 items saved."
            },

            // useMyPageEdit
            "updatingProfileSuccess": "Profile updated successfully.",
            "updatingProfileFail": "Failed to update profile.",

            // useAccountDelete
            "deletingUserSuccess": "Your account has been successfully deleted.",
            "deletingUserFail": "Failed to delete account.",
            "deletingUserConfirm": "Are You Sure You Want to Delete Your Account?",
            "deletingUserWarning": "This action is permanent and cannot be undone.",

            // BarcodeAddRequest
            "barcodeAddModalTitle": "Barcode:",
            "barcodeAddModalBody": "Product information does not exist.<br/><strong>Would you like to request an addition?</strong>",
            "confirmRequestButtonText": "Request",
            "barcodeAddSuccess": "Product addition request has been completed.",
            "barcodeAddError": "An error occurred while processing your request.",

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

            // 로그인
            "loginFormEmail": "Email",
            "loginFormPassword": "Password",
            "loginButton": "Login",
            "signupGuid": "Don’t have an account?",
            "signupButton": "Sign up here",
            "loginWelcome1": "Log In to",
            "loginWithGoogle": "Login with Google",
            "loginFailTitle": "Login failed. Please check your email or password.",
            "confirm": "OK",
            "bannedTitle": "Access Restricted",
            "bannedMessage": "You are banned from logging in until {{date}}.",

            // 문의사항
            "inquiry": {
                "title": "Submit Inquiry",
                "placeholder": "Please enter your inquiry.",
                "attachImages": "Attach Images",
                "emailLabel": "User Email",
                "privacyAgreement": "Agree to the privacy policy (required)",
                "privacyNotice": "To process your inquiry, we collect your email and any personal information included in your message.\nThis data is retained for 3 years and then discarded in accordance with our privacy policy.\nYou may choose not to agree, but in that case, you will not be able to submit an inquiry.",
                "agreeAlertTitle": "Please agree to the collection and use of personal information.",
                "submit": "Submit Inquiry",
                "types": {
                    "ACCOUNT": "Account Issue",
                    "PRODUCT_ADD": "Product Information",
                    "POINT_REVIEW": "Review Related",
                    "HOW_TO_USE": "How To Use",
                    "BUG": "Bug",
                    "ETC": "Other"
                },
                "loadFail": "Failed to load inquiry data.",
                "delete": {
                    "title": "Delete",
                    "confirmTitle": "Are you sure you want to delete your inquiry?",
                    "confirmText": "Once deleted, the changes cannot be undone.",
                    "confirmButton": "Delete",
                    "cancelButton": "Cancel",
                    "success": "Inquiry deleted successfully.",
                    "fail": "Failed to delete inquiry."
                },
                "postedOn": "Posted on",
                "updatedOn": "Updated on",
                "status": {
                    "ANSWERED": "Answered",
                    "PENDING": "Waiting"
                },
                "imageAlt": "Attached Image",
                "editTitle": "Edit Inquiry",
                "editPlaceholder": "Write your inquiry here",
                "editSubmit": "Submit Edit",
                "editFail": "Failed to update inquiry.",
                "deleteImageFail": "Failed to delete image.",
                "privacyAgree": "Agree to the privacy policy (required)",
                "privacyRequired": "Please agree to the privacy policy.",
                "addNewImages": "Add new images",
                "listTitle": "Q&A",
                "new": "New Inquiry",
                "empty": "You have not submitted any inquiries yet.",
                "answer": {
                    "admin": "Admin",
                    "posted": "Posted:",
                    "loadFail": "Failed to load answer."
                },
                "submitting": "Submitting inquiry...",
                "submitSuccess": "Inquiry submitted successfully",
                "submitFail": "Failed to submit inquiry",
                "edit": {
                    "updating": "Updating inquiry...",
                    "updateSuccess": "Inquiry updated successfully!",
                    "updateFail": "Failed to update inquiry",
                    "label": "Edit"
                },
                "updating": "Updating inquiry...",
                "updateSuccess": "Inquiry updated successfully!",
                "updateFail": "Failed to update inquiry"
            },
            "accessDenied": "Access denied.",
            "back": "Back",
            "menu": "Menu",

            // 푸시 알람
            "push": {
                "permissionDeniedTitle": "Notification permission is blocked.",
                "permissionDeniedText": "Please allow notification permission again in your browser settings.",
                "manageNotificationSettings": "Manage Notification Settings",
                "alertDescription": "Get alerts about new reviews and updates. You can always change this later.",
                "settingsPrefix": "Settings available under My Page Notifications",
                "update": "Update"
            },
            "cancel": "Close"

            //-----------------------------------------영어
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

            "productRanking":"상품 랭킹",
            "productSearch":"상품 검색",
            "recommendedProduct":"추천 상품",

            "searchBarPlaceholder": "상품명 검색",
            "sortProductLike": "좋아요 순",
            "sortProductScore": "별점 순",
            "sortProductMatch": "정확도 순",

            "productCategory": {
                "0": "전체",
                "1": "과자류",
                "2": "삼각김밥/김밥",
                "3": "면류",
                "4": "빵/디저트",
                "5": "아이스크림",
                "6": "캔디/껌",
                "7": "음료",
                "8": "샌드위치/햄버거",
                "9": "도시락",
                "10": "과일/샐러드",
                "11": "즉석섭취식품",
                "12": "즉석조리식품",
                "13": "식재료",
                "14": "건강식품",
                "15": "기타"
            },
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
            "myPageNotifications": "공지 사항",
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

            // 바코드 스캔
            "barcodeScanner": {
                "cameraPermissionRequired": "카메라 권한이 필요합니다.",
                "cameraPermissionTitle": "카메라 권한이 필요합니다.",
                "cameraPermissionText": "Peek&Pick의 바코드 인식을 위해 카메라 권한을 허용해주세요.",
                "cameraAccessFailedTitle": "카메라 접근 실패",
                "cameraAccessFailedText": "카메라 권한이 필요합니다.",
                "barcodeProcessFailedTitle": "바코드 처리 실패",
                "barcodeProcessFailedText": "바코드 인식 중 문제가 발생했습니다.",
                "confirmButton": "확인"
            },

            // 바코드 히스토리
            "barcodeHistory": {
                "title": "최근 바코드 내역",
                "noHistory": "바코드 기록이 없습니다.",
                "reviewAlready": "이미 리뷰가 작성되었습니다.",
                "writeReview": "리뷰 작성하기",
                "footerNote": "최근에 스캔한 바코드 기록은 최대 20개까지 자동 저장됩니다."
            },

            // useMyPageEdit
            "updatingProfileSuccess": "프로필 수정 완료.",
            "updatingProfileFail": "프로필 수정 실패.",

            // useAccountDelete
            "deletingUserSuccess": "계정 삭제 완료.",
            "deletingUserFail": "계정 삭제 실패.",
            "deletingUserConfirm": "계정을 삭제하시겠습니까?",
            "deletingUserWarning": "삭제하면 되돌릴 수 없습니다.",

            // BarcodeAddRequest
            "barcodeAddModalTitle": "바코드:",
            "barcodeAddModalBody": "상품 정보가 존재하지 않습니다.<br/><strong>상품 추가 요청</strong>을 하시겠습니까?",
            "confirmRequestButtonText": "요청하기",
            "barcodeAddSuccess": "상품 추가 요청이 완료되었습니다.",
            "barcodeAddError": "요청 처리 중 오류가 발생했습니다.",

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

            // 로그인
            "loginFormEmail": "이메일",
            "loginFormPassword": "비밀번호",
            "loginButton": "로그인",
            "signupGuid": "아직 회원이 아니신가요?",
            "signupButton": "가입하기",
            "loginWithGoogle": "Google로 계속하기",
            "loginWelcome1": "로그인",
            "loginFailTitle": "로그인 실패. 이메일 또는 비밀번호를 확인해주세요.",
            "confirm": "확인",
            "bannedTitle": "접근 제한",
            "bannedMessage": "{{date}}까지 로그인할 수 없습니다.",

            // 문의사항
            "inquiry": {
                "title": "문의 등록",
                "placeholder": "문의 내용을 입력해주세요.",
                "attachImages": "이미지 첨부",
                "emailLabel": "사용자 이메일",
                "privacyAgreement": "개인정보 수집 및 이용에 동의합니다. (필수)",
                "privacyNotice": "문의 접수를 위해 이메일 및 문의 내용 내 포함된 개인정보를 수집합니다.\n해당 정보는 3년간 보관 후 폐기됩니다.\n동의하지 않으면 문의 등록이 불가합니다.",
                "agreeAlertTitle": "개인정보 수집 및 이용에 동의해주세요.",
                "submit": "문의 등록",
                "types": {
                    "ACCOUNT": "계정 관련",
                    "PRODUCT_ADD": "상품 정보",
                    "POINT_REVIEW": "리뷰 관련",
                    "HOW_TO_USE": "사용 방법",
                    "BUG": "버그",
                    "ETC": "기타"
                },
                "loadFail": "문의 데이터를 불러오지 못했습니다.",
                "delete": {
                    "title": "삭제",
                    "confirmTitle": "정말 삭제하시겠습니까?",
                    "confirmText": "삭제하면 되돌릴 수 없습니다.",
                    "confirmButton": "삭제",
                    "cancelButton": "취소",
                    "success": "문의가 삭제되었습니다.",
                    "fail": "문의 삭제에 실패했습니다."
                },
                "postedOn": "작성일",
                "updatedOn": "수정일",
                "status": {
                    "PENDING": "답변 완료",
                    "ANSWERED": "답변 대기"
                },
                "imageAlt": "첨부 이미지",
                "editTitle": "문의 수정",
                "editPlaceholder": "문의 내용을 입력해주세요.",
                "editSubmit": "수정 완료",
                "editFail": "문의 수정에 실패했습니다.",
                "deleteImageFail": "이미지 삭제에 실패했습니다.",
                "privacyAgree": "개인정보 수집 및 이용에 동의합니다 (필수)",
                "privacyRequired": "개인정보 수집 및 이용에 동의해주세요.",
                "addNewImages": "새 이미지 추가",
                "listTitle": "Q&A",
                "new": "문의하기",
                "empty": "아직 작성한 문의가 없습니다.",
                "answer": {
                    "admin": "관리자",
                    "posted": "작성일:",
                    "loadFail": "답변을 불러오지 못했습니다."
                },
                "submitting": "문의 등록 중...",
                "submitSuccess": "문의가 성공적으로 등록되었습니다",
                "submitFail": "문의 등록에 실패했습니다",
                "edit": {
                    "updating": "문의사항을 수정 중입니다...",
                    "updateSuccess": "문의사항이 성공적으로 수정되었습니다!",
                    "updateFail": "문의사항 수정에 실패했습니다",
                    "label": "수정"
                },
                "updating": "문의 수정 중...",
                "updateSuccess": "문의가 성공적으로 수정되었습니다!",
                "updateFail": "문의 수정에 실패했습니다."
            },
            "back": "뒤로가기",
            "menu": "메뉴",
            "accessDenied": "접근이 거부되었습니다.",

            // 푸시 알람
            "push": {
                "permissionDeniedTitle": "알림 권한이 차단되어 있어요.",
                "permissionDeniedText": "브라우저 설정에서 알림 권한을 다시 허용해주세요.",
                "manageNotificationSettings": "알림 설정 관리",
                "alertDescription": "새로운 리뷰 및 업데이트 알림을 받아보세요. 언제든지 설정을 변경할 수 있습니다.",
                "settingsPrefix": "설정은 내 페이지 알림에서 변경할 수 있습니다",
                "update": "업데이트"
            },
            "cancel": "닫기"

            //-----------------------------------------한국어
        },
    },
    ja: {
        translation: {
            "postedOn": "投稿日",
            "moreButton": "もっと見る",

            "confirmOKButtonText": "かくにん",
            "confirmUpdateButtonText": "こうしん",
            "confirmDeleteButtonText": "さくじょ",
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

            "productRanking": "商品ランキング",
            "productSearch": "商品検索",
            "recommendedProduct": "おすすめ商品",

            "searchBarPlaceholder": "商品名を検索",
            "sortProductLike": "人気順",
            "sortProductScore": "評価順",
            "sortProductMatch": "関連順",

            "productCategory": {
                "0": "すべて",
                "1": "スナック",
                "2": "キンパ/おにぎり",
                "3": "麺類",
                "4": "パン/デザート",
                "5": "アイスクリーム",
                "6": "キャンディ/ガム",
                "7": "飲料",
                "8": "サンドイッチ/ハンバーガー",
                "9": "弁当",
                "10": "フルーツ/サラダ",
                "11": "すぐに食べられる",
                "12": "簡単な調理が必要",
                "13": "材料",
                "14": "健康食品",
                "15": "その他"
            },


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
            "myPageNotifications": "お知らせ",
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

            // 바코드 스캔
            "barcodeScanner": {
                "cameraPermissionRequired": "カメラの許可が必要です。",
                "cameraPermissionTitle": "カメラの許可が必要です",
                "cameraPermissionText": "Peek&Pickでバーコードをスキャンするには、カメラのアクセスを許可してください。",
                "cameraAccessFailedTitle": "カメラアクセス失敗",
                "cameraAccessFailedText": "カメラの権限が必要です。",
                "barcodeProcessFailedTitle": "バーコード処理失敗",
                "barcodeProcessFailedText": "バーコードの処理中に問題が発生しました。",
                "confirmButton": "確認"
            },

            // 바코드 히스토리
            "barcodeHistory": {
                "title": "最近のバーコード履歴",
                "noHistory": "バーコード履歴が見つかりません。",
                "reviewAlready": "レビューはすでに送信されました",
                "writeReview": "レビューを書く",
                "footerNote": "最近スキャンしたバーコードは最大20件まで自動的に保存されます。"
            },

            // useMyPageEdit
            "updatingProfileSuccess": "プロフィールを更新しました。",
            "updatingProfileFail": "プロフィールの更新に失敗しました。",

            // useAccountDelete
            "deletingUserSuccess": "アカウントを削除しました。",
            "deletingUserFail": "アカウントの削除に失敗しました。",
            "deletingUserConfirm": "アカウントを削除しますか？",
            "deletingUserWarning": "削除すると元に戻せません。",

            // BarcodeAddRequest
            "barcodeAddModalTitle": "バーコード：",
            "barcodeAddModalBody": "商品情報が存在しません。<br/><strong>商品追加リクエスト</strong>を送信しますか？",
            "confirmRequestButtonText": "リクエストする",
            "barcodeAddSuccess": "商品追加リクエストが完了しました。",
            "barcodeAddError": "リクエストの処理中にエラーが発生しました。",

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
            "mainBottomSearch": "検索",

            // 로그인
            "loginFormEmail": "メールアドレス",
            "loginFormPassword": "パスワード",
            "loginButton": "ログイン",
            "signupGuid": "新規登録はこちら",
            "signupButton": "新規登録",
            "loginWithGoogle": "Googleで続行",
            "loginWelcome1": "ログイン",
            "loginFailTitle": "ログインに失敗しました。メールまたはパスワードを確認してください。",
            "confirm": "確認",
            "bannedTitle": "アクセス制限",
            "bannedMessage": "{{date}}までログインできません。",

            // 문의사항
            "inquiry": {
                "title": "お問い合わせ",
                "placeholder": "お問い合わせ内容を入力してください。",
                "attachImages": "画像を添付",
                "emailLabel": "ユーザーのメールアドレス",
                "privacyAgreement": "個人情報の収集と利用に同意します（必須）",
                "privacyNotice": "お問い合わせ対応のため、メールアドレスおよびメッセージに含まれる個人情報を収集します。\nこの情報は3年間保管され、その後削除されます。\n同意しない場合、お問い合わせを送信できません。",
                "agreeAlertTitle": "個人情報の収集と利用への同意が必要です。",
                "submit": "送信する",
                "types": {
                    "ACCOUNT": "アカウントに関する問題",
                    "PRODUCT_ADD": "商品情報",
                    "POINT_REVIEW": "レビュー関連",
                    "HOW_TO_USE": "使い方",
                    "BUG": "バグ",
                    "ETC": "その他"
                },
                "loadFail": "お問い合わせデータの読み込みに失敗しました。",
                "delete": {
                    "title": "削除",
                    "confirmTitle": "お問い合わせを削除しますか？",
                    "confirmText": "一度削除すると元に戻せません。",
                    "confirmButton": "削除する",
                    "cancelButton": "キャンセル",
                    "success": "お問い合わせが削除されました。",
                    "fail": "お問い合わせの削除に失敗しました。"
                },
                "postedOn": "作成日",
                "updatedOn": "更新日",
                "status": {
                    "ANSWERED": "回答済み",
                    "PENDING": "未回答"
                },
                "imageAlt": "添付画像",
                "editTitle": "お問い合わせ編集",
                "editPlaceholder": "お問い合わせ内容をご記入ください。",
                "editSubmit": "編集を送信",
                "editFail": "お問い合わせの編集に失敗しました。",
                "deleteImageFail": "画像の削除に失敗しました。",
                "privacyAgree": "プライバシーポリシーに同意します（必須）",
                "privacyRequired": "プライバシーポリシーに同意してください。",
                "addNewImages": "新しい画像を追加",
                "listTitle": "Q&A",
                "new": "新規問い合わせ",
                "empty": "まだ問い合わせを送信していません。",
                "answer": {
                    "admin": "管理者",
                    "posted": "投稿日:",
                    "loadFail": "回答の読み込みに失敗しました。"
                },
                "submitting": "お問い合わせを送信中...",
                "submitSuccess": "お問い合わせが正常に送信されました",
                "submitFail": "お問い合わせの送信に失敗しました",
                "edit": {
                    "updating": "お問い合わせを更新中...",
                    "updateSuccess": "お問い合わせが正常に更新されました！",
                    "updateFail": "お問い合わせの更新に失敗しました",
                    "label": "編集"
                },
                "updating": "お問い合わせを更新中...",
                "updateSuccess": "お問い合わせが正常に更新されました！",
                "updateFail": "お問い合わせの更新に失敗しました。"
            },
            "back": "戻る",
            "menu": "メニュー",
            "accessDenied": "アクセスが拒否されました。",

            // 푸시 알람
            "push": {
                "permissionDeniedTitle": "通知の権限がブロックされています。",
                "permissionDeniedText": "ブラウザの設定で通知の権限を再度許可してください。",
                "manageNotificationSettings": "通知設定の管理",
                "alertDescription": "新しいレビューや更新の通知を受け取れます。設定はいつでも変更可能です。",
                "settingsPrefix": "設定はマイページ 通知から変更できます",
                "update": "更新"
            },
            "cancel": "閉じる"


            //-----------------------------------------일본어
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