# Nexus

**프로젝트 관리 기능을 갖춘 팀 협업 도구.**  

팀원들이 프로젝트 일정, 업무, 마일스톤을 효율적으로 관리할 수 있도록 돕는 올인원 플랫폼입니다.

> 개발 기간: 2024년 12월 31일 ~ 2025년 04월 11일 (총 4개월)

> 배포 링크: 👉 [Nexus 바로가기.](http://ec2-13-209-41-52.ap-northeast-2.compute.amazonaws.com/login)

<br>

## 기술 스택

### 주요 환경

| Language    | Framework                 | CI/CD          | Container | Database           | Realtime     | Storage | Deployment |
|-------------|---------------------------|----------------|-----------|---------------------|--------------|---------|-------------|
| TypeScript  | Nest.js v10 / Next.js v14 | GitHub Actions | Docker    | PostgreSQL / Redis | WebSocket    | AWS S3  | AWS EC2     |
### 주요 라이브러리

| Category     | Libraries                                                                                   |
|--------------|---------------------------------------------------------------------------------------------|
| Backend      | `@nestjs/typeorm` `class-validator` `@nestjs/jwt` `multer-s3` `@nestjs/websockets` `@nestjs/throttler` `nodemailer` `ioredis` |
| Frontend     | `@tanstack/react-query` `shadcn` `axios` `socket.io-client` `tailwindcss` `react-hook-form` `date-fns` `js-cookie` |

<br>

## 팀원 및 역할

| 이름     | 역할           |
|----------|----------------|
| 정수종   | Full-stack 개발 |
| 김보경   | Full-stack 개발 |

<br>

## 프로젝트 상세

### 인증 ( Sign In/Up, ResetPassword, MailAuthentication )

<details>
  <summary>상세 설명</summary>

  - google smtp 를 사용한 비밀번호 초기화 과정 (인증번호 전송)

</details>

<div style="display: flex; gap: 1rem; justify-content: center;">
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/login.png" alt="login" style="width: 49%;" />
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/register.png" alt="register" style="width: 49%;" />
</div>

<br>

<div style="display: flex; gap: 1rem; justify-content: center;">
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/reset_password.png" alt="login" style="width: 49%;" />
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/auth_mail.png" alt="register" style="width: 49%;" />
</div>

### 메인 페이지 ( MyProjects / RightNavBar / CreateProject )
<details>
  <summary>상세 설명</summary>

  - 오늘 날짜를 기준으로 프로젝트 상태를 '진행중', '완료됨', '예정됨'으로 구분하여 표시
  - 우측 내브바를 통해 금일 예정 혹은 진행 중인 일정을 빠르게 확인
  - 프로젝트 생성 (시작일과 마감일에 대한 유효성 검사를 진행, 기본 이미지 선택 또는 1장의 이미지를 직접 업로드)

</details>

<div style="display: flex; gap: 1rem; justify-content: center;">
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/myproject.png" alt="myprojects" style="width: 49%;" />
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/create_project.png" alt="create_project" style="width: 49%;" />
</div>

### 대시보드
<details>
  <summary>상세 설명</summary>

  - 프로젝트의 기본 정보, 참여 유저, 커뮤니티 (최신 순), 마일스톤 (금일 기준), 회의록 등을 요약해 보여줌
  - 이메일과 역할을 입력하여 유저를 추가

</details>

<div style="display: flex; gap: 1rem; justify-content: center;">
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/dashboard.png" alt="myprojects" style="width: 49%;" />
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/invite_user.png" alt="create_project" style="width: 49%;" />
</div>


### 커뮤니티 페이지 ( Notice / Feed / Vote )
<details>
  <summary>상세 설명</summary>

  - 공지사항, 피드, 투표 세 가지 유형의 게시글 작성이 가능 
  - 파일 및 이미지는 최대 10개까지 첨부 가능  
  - 댓글, 대댓글, 좋아요 기능을 제공
  - 공지사항은 PM만 작성할 수 있으며, 피드와 투표는 모든 유저가 작성 가능
  - 투표는 익명 여부, 단일/다중 선택 여부 설정 가능하며 상태(진행중/마감됨)를 표시

</details>

<div style="display: flex; gap: 1rem; justify-content: center;">
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/community.png" alt="community" style="width: 49%;" />
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/create_community.png" alt="create_community" style="width: 49%;" />
</div>

### 마일스톤 & 이슈 페이지
<details>
  <summary>상세 설명</summary>

  - 마일스톤 하위에 이슈들이 정렬되며, 프론트엔드/백엔드 필터링이 가능 
  - 해당 마일스톤에 언급된 유저만 이슈 작성이 가능

</details>


<div style="display: flex; gap: 1rem; justify-content: center;">
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/milestone_issues.png" alt="milestone_issues" style="width: 49%;" />
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/milestoneDetail.png" alt="milestone_detail" style="width: 49%;" />
</div>

### 회의록
<details>
  <summary>상세 설명</summary>

  - 회의록을 자유롭게 작성 및 저장

</details>

<div style="display: flex; gap: 1rem; justify-content: center;">
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/meeting_.png" alt="meeting1" style="width: 49%;" />
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/meeting.png" alt="meeting2" style="width: 49%;" />
</div>


### 내가 쓴 글 페이지
<details>
  <summary>상세 설명</summary>

  - 현재 프로젝트 내에서 내가 작성한 모든 글을 확인
  - 글 클릭 시 모달 형태로 자세히 확인 가능

</details>

<div style="display: flex; gap: 1rem; justify-content: center;">
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/myposted.png" alt="myposted1" style="width: 49%;" />
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/myposted_detail.png" alt="myposted2" style="width: 49%;" />
</div>


### 마이페이지 모달
<details>
  <summary>상세 설명</summary>

  - 본인 기본 정보 조회
  - 이름, 깃허브 주소, 주포지션, 비밀번호 수정 가능

</details>

<div style="display: flex; gap: 1rem; justify-content: center;">
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/mypage_.png" alt="mypage1" style="width: 49%;" />
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/mypage.png" alt="mypage2" style="width: 49%;" />
</div>

### 채팅
<details>
  <summary>상세 설명</summary>

  - 개인 / 단체 채팅 기능

</details>

<div style="display: flex; gap: 1rem; justify-content: center;">
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/chat(1).png" alt="chat1" style="width: 24%;" />
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/chat(2).png" alt="chat2" style="width: 24%;" />
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/chat(3).png" alt="chat1" style="width: 24%;" />
  <img src="https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/chat(4).png" alt="chat2" style="width: 24%;" />
</div>

<br>
<br>


> 그 외 다양한 기능은 배포된 링크를 통해 확인 👉 [Nexus 바로가기](http://ec2-13-209-41-52.ap-northeast-2.compute.amazonaws.com/login)

<br>

## 프로젝트 구성

### API 명세서  

> Postman을 이용하여 API 문서를 작성

👉 [API 문서 보기 (Postman)](https://www.postman.com/orange-sunset-704837/nexus/overview)

### 아키텍처 구성도  

> 프론트엔드, 백엔드, 데이터베이스, 스토리지 등 주요 인프라 구성을 시각화

![아키텍처](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/nexus_architecture.png)

### ERD (Entity Relationship Diagram)
 
> 효율적인 데이터베이스 설계와 명확한 도메인 정의를 위해 활용

![ERD](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/nexus_erd.png)

### 디자인 시안  

> Figma 기반 디자인 시안을 참고하여 UI/UX를 구성

![디자인 시안](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/nexus_figma.png)

