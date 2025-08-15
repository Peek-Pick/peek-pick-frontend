<a name="top"></a>

<img width="1920" height="1080" alt="깃허브 메인" src="https://github.com/user-attachments/assets/2756ad3f-918f-4009-8b4c-a5960550474e" />
<br><br>
  
# 외국인 맞춤 쇼핑지원 서비스, Peek&Pick

> **Peek&Pick(픽앤픽)** 은 바코드 스캔을 통해 상품 정보를 조회하고, 태그 기반 추천, 리뷰 요약 및 번역 기능을 제공하여 외국인 사용자의 한국 쇼핑을 돕는 서비스로 **훑어보고(Peek), 고른다(Pick)** 는 의미를 담고 있습니다.
<br>

- **구분**: 팀 프로젝트  
- **기간**: 2025년 5월 8일 ~ 2025년 7월 11일

<br>

<details>
  <summary>📑 Table of Contents</summary>

- [👤 팀원 (Team Members)](#team-members)  
- [📌 프로젝트 개요 (Project Overview)](#project-overview)  
- [🔍 주요 기능 (Key Features)](#key-features)  
- [🧰 기술 스택 (Tech Stack)](#tech-stack)
- [🖥️ 개발 환경 (Software & Tools)](#software-tools)
- [📽 프로젝트 시연 (Project Demo)](#project-demo)  
- [🖇 ERD (Entity-Relationship-Diagram)](#erd)
- [🏗️ 서비스 아키텍처 (Service Architecture)](#service-architecture)  
- [📂 프로젝트 자료 (Documents)](#documents)

</details>

<br><br>

## <a id="team-members"></a> 👤 팀원 (Team Members)
<div align="center">
<table>
	<tr>
    <td><img width="125" height="203" alt="소연" src="https://github.com/user-attachments/assets/af609127-366e-40f3-8fe1-5634cff8bcb1" /></td>
    <td><img width="112" height="234" alt="동훈" src="https://github.com/user-attachments/assets/7b01e8e6-4d4a-4514-862f-5ba6bef9077f" /></td>
    <td><img width="126" height="205" alt="강민" src="https://github.com/user-attachments/assets/229be833-2d84-48e5-8750-c8e531b653aa" /></td>
    <td><img width="126" height="205" alt="근화" src="https://github.com/user-attachments/assets/82a3e588-965e-4878-8358-4bea9d3bc5c8" /></td>
    <td><img width="108" height="216" alt="은진" src="https://github.com/user-attachments/assets/c283a733-42ef-4e56-bb56-e2d88c435cd2" /></td>
	</tr>
  <tr>
    <th><a href="https://github.com/KimSoYeonnn">김소연</a></th>
    <th><a href="https://github.com/limdhun">강동훈</a></th>
    <th><a href="https://github.com/bkm0096">배강민</a></th>
    <th><a href="https://github.com/geunhwa37">이근화</a></th>
    <th><a href="https://github.com/pobingbin99">이은진</a></th>
  </tr>
  <tr align="center">
    <td>팀장<br>BE, FE</td>
    <td>BE, FE</td>
    <td>BE, FE</td>
    <td>BE, FE</td>
    <td>BE, FE</td>
  </tr>
</table>
</div>
<br><br>

## <a id="project-overview"></a>📌 프로젝트 개요 (Project Overview)

최근 한국 편의점은 **‘미니 관광 코스’** 로 주목받으며 외국인 관광객 사이에서 큰 인기를 끌고 있습니다.  
SNS에서는 한국 제품을 소개하는 콘텐츠가 화제가 되고 있지만, 외국인 방문자들은 실제로 제품을 구매할 때 **언어 장벽과 정보 부족**으로 불편을 겪고 있습니다.

기존의 바코드 스캔 앱(예: **ScanLife**, **Payke**)은 국내 사용자 리뷰가 부족하고, 커뮤니티 기반 Q&A는 응답 시간이 길어 **실시간 정보 획득이 어렵습니다**.

이에 팀 **‘삑 그리고 다음’** 은 **바코드 스캔만으로 상품 정보와 사용자 리뷰를 실시간 확인**하고, **AI 기반 맞춤 추천 기능까지 제공**하는  
**외국인 대상 쇼핑 지원 서비스, Peek&Pick(픽앤픽)** 을 제안합니다.

<br><br>

## <a id="key-features"></a>🔍 주요 기능 (Key Features)

### ✅ 사용자 기능 (User Features)

- **바코드 스캔 상품 조회**  
  → 제품명, 원산지, 성분, 가격 등 상세 정보를 실시간 제공
- **리뷰 요약 및 번역**  
  → AI가 리뷰를 긍정/부정으로 요약하고, 사용자 언어로 번역 제공
- **상품 추천 및 검색**  
  → 사용자 선호 태그 기반 AI 추천  
  → 리뷰 평점/좋아요 기반 랭킹 제공  
  → Elasticsearch 기반 정밀 검색
- **위치 기반 편의점 안내**  
  → 현재 위치를 기반으로 근처 편의점을 지도에 표시
- **AI 챗봇 추천 상담**  
  → 챗봇과 대화하며 개인 맞춤 상품 추천
- **리뷰 작성 알림**  
  → 스캔 후 리뷰 미작성 시 푸시 알림 전송

### ✅ 관리자 기능 (Admin Features)

- **상품 등록 및 바코드 관리**  
  → 상품 추가, 정보 수정, 이미지 업로드, 바코드 관리
- **리뷰 데이터 관리**  
  → 사용자 리뷰 모니터링 및 신고 리뷰 삭제/숨김 처리
- **사용자 관리**  
  → 사용자 활동 내역 확인, 부적절한 사용자 제재 가능
- **문의 및 요청사항 확인**  
  → 사용자 문의, 상품 등록 요청 응대 및 관리
- **통계 대시보드 제공**  
  → 가입자 수, 리뷰 수, 국적 분포 등 통계를 그래프로 시각화

<br><br>

## <a id="tech-stack"></a>🧰 기술 스택 (Tech Stack)

### 🚀 Frontend
- HTML, CSS, TailwindCSS, Bootstrap
- React.js, React Router v7, React Query
- ZXing API (바코드 스캔)
- Google Maps API
- Firebase API
- PWA (Progressive Web App)

### 🔧 Backend
- Spring Boot, Spring Security
- Spring Data JPA, Spring AI
- OpenAI API, DeepL API, Google Natural Language API
- 공공데이터포털 API
- Elasticsearch
- Google OAuth API

### 🗄 Database
- PostgreSQL

### ☁️ Deployment
- AWS
- Apache Tomcat

<br><br>

## <a id="software-tools"></a>🖥️ 개발 환경 (Software & Tools)

- **개발 언어**: Java 17, TypeScript  
- **IDE**: IntelliJ, VS Code, DBeaver  
- **형상 관리**: Git, GitHub  
- **협업 도구**: Notion, Google Drive

<br><br>

## <a id="project-demo"></a>📽 프로젝트 시연 (Project Demo)

💛 [사용자 화면 시연 영상](https://youtu.be/p_8_L8ORM1Y?si=4dsnsivMwqGSW3gS)  
💙 [관리자 화면 시연 영상](https://youtu.be/jMc5VIBdmTU?si=YW8kjQd8KWYMJAJO)

<br><br>

## <a id="erd"></a>🖇 ERD (Entity Relationship Diagram)
<img width="2122" height="1063" alt="ERD" src="https://github.com/user-attachments/assets/919645c9-d723-48db-9c8a-7bbe6de348ac" />

<br><br>

## <a id="service-architecture"></a>🏗️ 서비스 아키텍처 (Service Architecture)
<img width="2964" height="1444" alt="서비스아키텍처" src="https://github.com/user-attachments/assets/90670615-1094-4449-bf1c-552b7f446c1e" />

<br><br>

## <a id="documents"></a>📂 프로젝트 자료 (Documents)
- [🗣️ 발표 자료](https://github.com/Peek-Pick/peek-pick-frontend/blob/master/docs/3%E1%84%8C%E1%85%A9_Peek%26Pick_%E1%84%87%E1%85%A1%E1%86%AF%E1%84%91%E1%85%AD%E1%84%8C%E1%85%A1%E1%84%85%E1%85%AD(pdf).pdf)
- [🧾 화면 설계서](https://github.com/Peek-Pick/peek-pick-frontend/blob/master/docs/3%E1%84%8C%E1%85%A9_%E1%84%88%E1%85%B5%E1%86%A8%E1%84%80%E1%85%B3%E1%84%85%E1%85%B5%E1%84%80%E1%85%A9%E1%84%83%E1%85%A1%E1%84%8B%E1%85%B3%E1%86%B7_%E1%84%92%E1%85%AA%E1%84%86%E1%85%A7%E1%86%AB%E1%84%89%E1%85%A5%E1%86%AF%E1%84%80%E1%85%A8%E1%84%89%E1%85%A5.pdf)
- [📄 요구사항 정의서](https://github.com/Peek-Pick/peek-pick-frontend/blob/master/docs/3%E1%84%8C%E1%85%A9_%E1%84%88%E1%85%B5%E1%86%A8%E1%84%80%E1%85%B3%E1%84%85%E1%85%B5%E1%84%80%E1%85%A9%E1%84%83%E1%85%A1%E1%84%8B%E1%85%B3%E1%86%B7_%E1%84%92%E1%85%AA%E1%84%86%E1%85%A7%E1%86%AB%E1%84%89%E1%85%A5%E1%86%AF%E1%84%80%E1%85%A8%E1%84%89%E1%85%A5.pdf)
- [📋 API 명세서](https://github.com/Peek-Pick/peek-pick-frontend/blob/master/docs/3%E1%84%8C%E1%85%A9_%E1%84%88%E1%85%B5%E1%86%A8%E1%84%80%E1%85%B3%E1%84%85%E1%85%B5%E1%84%80%E1%85%A9%E1%84%83%E1%85%A1%E1%84%8B%E1%85%B3%E1%86%B7_%E1%84%92%E1%85%AA%E1%84%86%E1%85%A7%E1%86%AB%E1%84%89%E1%85%A5%E1%86%AF%E1%84%80%E1%85%A8%E1%84%89%E1%85%A5.pdf)
- [📂 메뉴 트리](https://github.com/Peek-Pick/peek-pick-frontend/blob/master/docs/3%E1%84%8C%E1%85%A9_%E1%84%88%E1%85%B5%E1%86%A8%E1%84%80%E1%85%B3%E1%84%85%E1%85%B5%E1%84%80%E1%85%A9%E1%84%83%E1%85%A1%E1%84%8B%E1%85%B3%E1%86%B7_%E1%84%86%E1%85%A6%E1%84%82%E1%85%B2%E1%84%90%E1%85%B3%E1%84%85%E1%85%B5.pdf)

<br><br>
<h5 align="right"><a href="#top">⬆️ TOP</a></h5>
