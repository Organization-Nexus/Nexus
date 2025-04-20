# Nexus

**프로젝트 관리 기능을 갖춘 팀 협업 도구**  
팀원들이 프로젝트 일정, 업무, 마일스톤을 효율적으로 관리할 수 있도록 돕는 올인원 플랫폼입니다.

> 개발 기간: 2024년 12월 31일 ~ 2025년 04월 11일 (총 4개월)

> 배포 링크: 👉 [Nexus 바로가기](http://ec2-13-209-41-52.ap-northeast-2.compute.amazonaws.com/login)

<br>

## 주요 기술 스택

| 언어        | 프레임워크              | CI/CD          | 컨테이너화 | 데이터베이스 | 실시간 통신 | 스토리지 | 배포환경 |
|-------------|--------------------------|----------------|-------------|---------------|---------------|-----------|-----------|
| TypeScript  | Nest.js v10 / Next.js v14 | GitHub Actions | Docker      | PostgreSQL     | WebSocket     | AWS S3    | AWS EC2   |

<br>

## 팀원 및 역할

| 이름     | 역할           |
|----------|----------------|
| 정수종   | Full-stack 개발 |
| 김보경   | Full-stack 개발 |

<br>

## 프로젝트 상세

### 메인 페이지
<details>
  <summary>상세 설명</summary>

  - 오늘 날짜를 기준으로 프로젝트 상태를 '진행중', '완료됨', '예정됨'으로 구분하여 표시
  - 우측 네브바를 통해 금일 예정 혹은 진행 중인 일정을 빠르게 확인

</details>

![myprojects](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/myproject.png)


### 프로젝트 생성
<details>
  <summary>상세 설명</summary>

  - 프로젝트 이름, 설명, 기간 등을 설정 
  - 시작일과 마감일에 대한 유효성 검사를 진행
  - 기본 이미지 선택 또는 1장의 이미지를 직접 업로드

</details>

![create_project](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/create_project.png)


### 대시보드
<details>
  <summary>상세 설명</summary>

  - 프로젝트의 기본 정보, 참여 유저, 커뮤니티, 마일스톤, 회의록 등을 요약해 보여줌 
  - 이메일과 역할을 입력하여 유저를 추가

</details>

![dashboard](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/dashboard.png)


### 커뮤니티 (공지사항 / 피드 / 투표)
<details>
  <summary>상세 설명</summary>

  - 공지사항, 피드, 투표 세 가지 유형의 게시글 작성이 가능 
  - 파일 및 이미지는 최대 10개까지 첨부 가능  
  - 댓글, 대댓글, 좋아요 기능을 제공
  - 공지사항은 PM만 작성할 수 있으며, 피드는 모든 유저가 작성 가능
  - 투표는 익명 여부, 단일/다중 선택 여부 설정 가능하며 상태(진행중/마감됨)를 표시

</details>

![community](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/community.png)


### 마일스톤 & 이슈
<details>
  <summary>상세 설명</summary>

  - 마일스톤 하위에 이슈들이 정렬되며, 프론트엔드/백엔드 필터링이 가능 
  - 해당 마일스톤에 언급된 유저만 이슈 작성이 가능

</details>

![milestone_issues](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/milestone_issues.png)


### 내가 쓴 글
<details>
  <summary>상세 설명</summary>

  - 현재 프로젝트 내에서 내가 작성한 모든 글을 확인
  - 글 클릭 시 모달 형태로 자세히 확인 가능

</details>

![myPosted](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/myposted.png)


### 채팅 & 회의록
<details>
  <summary>상세 설명</summary>

  - 실시간 채팅 기능이 제공 (어느 위치에서든 접근이 가능)
  - 회의록을 자유롭게 작성 및 저장

</details>

![chat](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/chat.png)


### 마이페이지
<details>
  <summary>상세 설명</summary>

  - 본인의 기본 정보를 조회하고 수정 가능

</details>

![mypage](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/mypage.png)


### 프로젝트 관리
<details>
  <summary>상세 설명</summary>

  - 프로젝트의 이름, 설명, 기간 등 기본 정보를 수정 가능

</details>

![manage_project](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/manage_project.png)


### 이메일 인증
<details>
  <summary>상세 설명</summary>

  - 비밀번호 재설정 시 이메일 인증 절차를 거침
  - Google SMTP를 이용하여 인증 메일을 발송

</details>

![reset_password](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/pages/reset_password.png)

<br>


> 그 외 다양한 기능은 배포된 링크를 통해 확인 👉 [Nexus 바로가기](http://ec2-13-209-41-52.ap-northeast-2.compute.amazonaws.com/login)

<br>

## 프로젝트 구성

### API 명세서  

> Postman을 이용하여 API 문서를 작성하였습니다.

👉 [API 문서 보기 (Postman)](https://www.postman.com/orange-sunset-704837/nexus/overview)

### 디자인 시안  

> Figma 기반 디자인 시안을 참고하여 UI/UX를 구성했습니다.

![디자인 시안](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/nexus_design_preview.png)


### ERD (Entity Relationship Diagram)
 
> 효율적인 데이터베이스 설계와 명확한 도메인 정의를 위해 활용되었습니다.

![ERD](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/nexus_erd.png)


### 아키텍처 구성도  

> 프론트엔드, 백엔드, 데이터베이스, 스토리지 등 주요 인프라 구성을 시각화했습니다.

![아키텍처](https://nexus-s3cloud.s3.ap-northeast-2.amazonaws.com/common/nexus_architecture.png)
