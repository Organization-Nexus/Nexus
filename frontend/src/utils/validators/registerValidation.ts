export const registerValidation = {
  name: (value: string): string | undefined => {
    if (!value) return "이름을 입력해주세요.";
    if (value.length < 2) return "이름은 2자 이상이어야 합니다.";
    if (value.length > 10) return "이름은 10자 이하여야 합니다.";
    return undefined;
  },
  email: (value: string): string | undefined => {
    if (!value) return "이메일을 입력해주세요.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "올바른 이메일 형식이 아닙니다.";
    return undefined;
  },
  password: (value: string): string | undefined => {
    if (!value) return "비밀번호를 입력해주세요.";
    // if (value.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
    // if (value.length > 16) return "비밀번호는 16자 이하여야 합니다.";
    // if (!/[A-Z]/.test(value)) return "대문자를 포함해야 합니다.";
    // if (!/[a-z]/.test(value)) return "소문자를 포함해야 합니다.";
    // if (!/[0-9]/.test(value)) return "숫자를 포함해야 합니다.";
    // if (!/[!@#$%^&*]/.test(value)) return "특수문자를 포함해야 합니다.";
    return undefined;
  },
  phoneNumber: (value: string): string | undefined => {
    if (!value) return "전화번호를 입력해주세요.";
    const phoneRegex = /^010[0-9]{7,8}$/;
    if (!phoneRegex.test(value)) return "올바른 전화번호 형식이 아닙니다.";
    return undefined;
  },
  githubUrl: (value: string | undefined): string | undefined => {
    if (!value) return undefined;
    const githubRegex = /^https:\/\/github\.com\/[a-zA-Z0-9-]+$/;
    if (!githubRegex.test(value)) return "올바른 URL이 아닙니다.";
    return undefined;
  },
};
