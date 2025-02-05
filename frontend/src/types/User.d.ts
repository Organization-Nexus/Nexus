export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber: string;
  mainPosition: string;
  githubUrl: string | null;
  role: string;
  log: {
    profileImage: string; //서버에서 받아오는 데이터의 경우 항상 이미지는 URL 형태이기때문에 string
  };
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
  githubUrl?: string;
  mainPosition?: string;
}

export interface UpdateUserDto {
  name: string;
  mainPosition: string;
  githubUrl: string | null;
  profileImage?: File; // 새 이미지 업로드 시
  profileImageUrl?: string; // 기존 이미지 URL 유지 시
}

export interface MyPageUserInfo {
  name: string;
  mainPosition: string;
  githubUrl: string | null;
  profileImage: string;
}
