# 천체관측 서비스 StarHub Server

![IMG_2526 iphonex (1)](https://github.com/Kumoh-OpenSource-Project/backend/assets/98962864/552ea124-18da-49e7-87c8-7977d680f121)


<br>

## ☝프로젝트 소개

- 천체 관측에 필요한 기초적인 정보들을 제공합니다.
- 커뮤니티 기능을 제공하여 필요한 배경지식을 채울 수 있습니다.
- 검색을 통해 천체관측에 대한 의사소통을 꾀합니다.
- 마음에 드는 게시글에 좋아요, 스크랩을 누르거나 댓글을 작성할 수 있습니다.
- 본 레포지토리는 서버를 소개합니다.
  
<br>

## 👨🏻‍💻Backend 팀원 구성

<div align="center">

| **김현진** | **이지현** |
| :------: |  :------: |
| [<img src="https://avatars.githubusercontent.com/u/98962864?v=4" height=150 width=150> <br/> @badasskim](https://github.com/badasskim)| [<img src="https://avatars.githubusercontent.com/u/77794756?v=4" height=150 width=150> <br/> @journeybongbong](https://github.com/journeybongbong)
</div>

<br>

## 🔨개발 환경

  + Node.js (18.x)
  + Framework : Nest.js (10.x)
  + IDE : Vscode
  + Database : Mysql 8.0
  + Deployment : AWS EC2, Docker
  + Static Analysis Tool : SonarLint
  + Jira, Notion, Slack
<br>

## ⚙️채택한 개발 기술과 브랜치 전략

### Nest.js
  - typescript 기반 웹 프레임워크로 타입 검사, 의존성 주입 등으로 코드 재사용성을 꾀했습니다.
    
### 브랜치 전략

- Git-flow 전략을 기반으로 main, develop 브랜치와 feature 보조 브랜치로 간소화 하여 사용했습니다.
- main, develop, Feat 브랜치로 나누어 개발을 하였습니다.
    - **Main** 브랜치는 최종 배포 단계에서만 사용하는 브랜치입니다. dev 브랜치에서 병합 시 github action으로 ci/cd 가 이루어집니다.
    - **Dev** 브랜치는 개발 단계의 Feature 브랜치들의 집합 브랜치입니다.
    - **Feat** 브랜치는 기능 단위로 독립적인 개발 환경을 위하여 사용하였습니다. Feature 브랜치명은 Jira Service의 각 ticket에 부여되는 고유 id로 작성하였습니다.

<br>

## 📜프로젝트 구조

### System Diagram
![백엔드 drawio](https://github.com/Kumoh-OpenSource-Project/backend/assets/98962864/458feae4-d3d8-4491-be9f-3ef8cfe0ec51)
<br>

### ER Diagram
![erd](https://github.com/Kumoh-OpenSource-Project/backend/assets/98962864/1ce02c50-fb1d-4747-870e-dc75cca06779)
<br>

### Class Diagram
![src_diagram](https://github.com/Kumoh-OpenSource-Project/backend/assets/98962864/f191e780-89af-4467-ab67-1c91db4e0d23)
<br>


```
src
 ┣ articles
 ┃ ┣ dto
 ┃ ┃ ┣ article-id-dto.ts
 ┃ ┃ ┣ article-informaition-dto.ts
 ┃ ┃ ┣ comment-id-dto.ts
 ┃ ┃ ┣ create-article-dto.ts
 ┃ ┃ ┣ create-comment-dto.ts
 ┃ ┃ ┣ search-context-dto.ts
 ┃ ┃ ┗ update-article-dto.ts
 ┃ ┣ articles.controller.ts
 ┃ ┣ articles.module.ts
 ┃ ┗ articles.service.ts
 ┣ auth
 ┃ ┣ auth.controller.ts
 ┃ ┣ auth.module.ts
 ┃ ┣ auth.service.ts
 ┃ ┗ kakao.straegy.ts
 ┣ common
 ┃ ┣ decorator
 ┃ ┃ ┣ latlon.decorator.ts
 ┃ ┃ ┗ user.id.decorator.ts
 ┃ ┣ dto
 ┃ ┃ ┣ home
 ┃ ┃ ┃ ┣ current-weather.dto.ts
 ┃ ┃ ┃ ┣ moon-age.dto.ts
 ┃ ┃ ┃ ┣ today-weather.dto.ts
 ┃ ┃ ┃ ┗ week-weather.dto.ts
 ┃ ┃ ┗ user
 ┃ ┃ ┃ ┣ user.dto.ts
 ┃ ┃ ┃ ┗ userAllInfo.dto.ts
 ┃ ┗ year.pipe.ts
 ┣ entities
 ┃ ┣ Article.ts
 ┃ ┣ ArticleCategory.ts
 ┃ ┣ Comment.ts
 ┃ ┣ Events.ts
 ┃ ┣ Photo.ts
 ┃ ┣ User.ts
 ┃ ┣ UserClipped.ts
 ┃ ┗ UserLike.ts
 ┣ guard
 ┃ ┗ user.auth.guard.ts
 ┣ home
 ┃ ┣ weather
 ┃ ┃ ┣ api
 ┃ ┃ ┃ ┣ astro.api.ts
 ┃ ┃ ┃ ┣ coordinate.transition.ts
 ┃ ┃ ┃ ┗ sun-moon.api.ts
 ┃ ┃ ┣ processors
 ┃ ┃ ┃ ┣ openWeather.processor.ts
 ┃ ┃ ┃ ┣ todayWeather.processor.ts
 ┃ ┃ ┃ ┗ weather.processor.ts
 ┃ ┃ ┗ weather.service.ts
 ┃ ┣ event.service.ts
 ┃ ┣ home.controller.ts
 ┃ ┣ home.module.ts
 ┃ ┗ home.service.ts
 ┣ mypage
 ┃ ┣ dto
 ┃ ┃ ┗ getMine.dto.ts
 ┃ ┣ mypage.controller.ts
 ┃ ┣ mypage.module.ts
 ┃ ┗ mypage.service.ts
 ┣ report
 ┃ ┣ dto
 ┃ ┃ ┗ create-report.dto.ts
 ┃ ┣ report.controller.ts
 ┃ ┣ report.module.ts
 ┃ ┗ report.service.ts
 ┣ user
 ┃ ┣ user.controller.ts
 ┃ ┣ user.module.ts
 ┃ ┗ user.service.ts
 ┣ app.controller.spec.ts
 ┣ app.controller.ts
 ┣ app.module.ts
 ┣ app.service.ts
 ┗ main.ts
```

<br>

### Used Open API
- KAKAO login API
  - https://developers.kakao.com/docs/latest/ko/kakaologin/common
 
- OpenWeatherMap
  - https://openweathermap.org/weather-conditions
- 7Timer!
  - http://www.7timer.info/doc.php?lang=en
- Sunrise Sunset
  -  https://sunrise-sunset.org/api
- 기상청 단기예보 조회 서비스
  - https://www.data.go.kr/data/15084084/openapi.do
- 한국천문연구원 월령 정보
  - https://www.data.go.kr/data/15012689/openapi.do#/tab_layer_detail_function
- 한국천문연구원 출몰시각 정보
  - https://www.data.go.kr/data/15012688/openapi.do
- Slack Api
  - https://api.slack.com/ 



<br>

## 🤝역할 분담

### 🐸김현진
- **기능**
    - 로그인 및 유효성 검사
    - 유저, 게시글-댓글, 좋아요-스크랩 crud
    - EC2 instance, S3 및 erd작성, mysql 구축

<br>
    
### 🐷이지현
- **기능**
    - 천체 관측 정보 받아오기
      - 실시간 날씨, 당일 예보, 주간 예보, 월령, 천체 관측 정도, 천체 이벤트 디데이
    - 커뮤니티 활동 조회 구현
    - CI/CD 구축
    
<br>

## 📆개발 기간 및 작업 관리

### 개발 기간

- 총 9차 스프린트 진행 완료

<br>

![image](https://github.com/Kumoh-OpenSource-Project/backend/assets/98962864/1f2c7984-e92a-4845-a340-3feeb71e6a55)


## 📹︎시연 영상

[![Video Label](http://img.youtube.com/vi/gHagJYh-x2Q/0.jpg)](https://youtu.be/gHagJYh-x2Q)

