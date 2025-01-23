export const VALIDATION_CONSTANTS = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 5,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 16,
  },
  CODE: {
    LENGTH: 6,
  },
  CODE_TIMEOUT: 180,
  RESEND_TIMEOUT: 60,
  REGEX: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^010[0-9]{7,8}$/,
    GITHUB: /^https:\/\/github\.com\/[a-zA-Z0-9-]+$/,
    PASSWORD: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
  },
};

// 에러 메시지
export const ERROR_MESSAGES = {
  // 이름 관련
  NAME_REQUIRED: "이름을 입력해주세요.",
  NAME_TOO_SHORT: `이름은 ${VALIDATION_CONSTANTS.NAME.MIN_LENGTH}자 이상이어야 합니다.`,
  NAME_TOO_LONG: `이름은 ${VALIDATION_CONSTANTS.NAME.MAX_LENGTH}자 이하여야 합니다.`,

  // 이메일 관련
  EMAIL_REQUIRED: "이메일을 입력해주세요.",
  EMAIL_INVALID: "올바른 이메일 형식이 아닙니다.",

  // 비밀번호 관련
  PASSWORD_REQUIRED: "비밀번호를 입력해주세요.",
  PASSWORD_LENGTH: `비밀번호는 ${VALIDATION_CONSTANTS.PASSWORD.MIN_LENGTH}자 이상 ${VALIDATION_CONSTANTS.PASSWORD.MAX_LENGTH}자 이하여야 합니다.`,
  PASSWORD_UPPERCASE: "대문자를 포함해야 합니다.",
  PASSWORD_LOWERCASE: "소문자를 포함해야 합니다.",
  PASSWORD_NUMBER: "숫자를 포함해야 합니다.",
  PASSWORD_SPECIAL: "특수문자(!@#$%^&*)를 포함해야 합니다.",

  // 전화번호 관련
  PHONE_REQUIRED: "전화번호를 입력해주세요.",
  PHONE_INVALID: "올바른 전화번호 형식이 아닙니다.",

  // Github URL 관련
  GITHUB_INVALID: "올바른 Github URL이 아닙니다.",

  // 비밀번호 재설정 관련 메시지 추가
  CODE_REQUIRED: "인증번호를 입력해주세요.",
  CODE_LENGTH: `인증번호는 ${VALIDATION_CONSTANTS.CODE.LENGTH}자리여야 합니다.`,
  CODE_INVALID: "잘못된 인증번호입니다.",
  PASSWORD_MISMATCH: "비밀번호가 일치하지 않습니다.",
  NEW_PASSWORD_REQUIRED: "새 비밀번호를 입력해주세요.",
  CONFIRM_PASSWORD_REQUIRED: "비밀번호를 입력해주세요.",

  // API 관련 에러 메시지
  API_ERROR: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  EMAIL_SEND_ERROR: "이메일 전송에 실패했습니다. 다시 시도해주세요.",
  EMAIL_SEND_LIMIT_ERROR:
    "요청 횟수를 초과했습니다. 메일은 1분에 한 번만 전송 가능합니다.🥲\n 잠시 후에 다시 시도해주세요.",
  CODE_VERIFY_ERROR: "인증번호 확인에 실패했습니다.",
  PASSWORD_RESET_ERROR: "비밀번호 변경에 실패했습니다.",
};

// 성공 메시지
export const SUCCESS_MESSAGES = {
  CODE_SENT: "인증 코드가 이메일로 전송되었습니다. 이메일을 확인해주세요.",
  CODE_RESENT: "인증 코드가 재전송되었습니다. 이메일을 확인해주세요.",
  CODE_VERIFIED: "인증번호가 확인되었습니다.",
  PASSWORD_RESET: "비밀번호가 성공적으로 변경되었습니다.",
};

export const userValidation = {
  name: (value: string): string | undefined => {
    if (!value) return ERROR_MESSAGES.NAME_REQUIRED;
    if (value.length < VALIDATION_CONSTANTS.NAME.MIN_LENGTH)
      return ERROR_MESSAGES.NAME_TOO_SHORT;
    if (value.length > VALIDATION_CONSTANTS.NAME.MAX_LENGTH)
      return ERROR_MESSAGES.NAME_TOO_LONG;
    return undefined;
  },

  email: (value: string): string | undefined => {
    if (!value) return ERROR_MESSAGES.EMAIL_REQUIRED;
    if (!VALIDATION_CONSTANTS.REGEX.EMAIL.test(value))
      return ERROR_MESSAGES.EMAIL_INVALID;
    return undefined;
  },

  password: (value: string): string | undefined => {
    if (!value) return ERROR_MESSAGES.PASSWORD_REQUIRED;
    // if (value.length < VALIDATION_CONSTANTS.PASSWORD.MIN_LENGTH ||
    //     value.length > VALIDATION_CONSTANTS.PASSWORD.MAX_LENGTH) {
    //   return ERROR_MESSAGES.PASSWORD_LENGTH;
    // }
    // if (!VALIDATION_CONSTANTS.REGEX.PASSWORD.test(value)) {
    //   if (!/[A-Z]/.test(value)) return ERROR_MESSAGES.PASSWORD_UPPERCASE;
    //   if (!/[a-z]/.test(value)) return ERROR_MESSAGES.PASSWORD_LOWERCASE;
    //   if (!/[0-9]/.test(value)) return ERROR_MESSAGES.PASSWORD_NUMBER;
    //   if (!/[!@#$%^&*]/.test(value)) return ERROR_MESSAGES.PASSWORD_SPECIAL;
    // }
    return undefined;
  },

  phoneNumber: (value: string): string | undefined => {
    if (!value) return ERROR_MESSAGES.PHONE_REQUIRED;
    if (!VALIDATION_CONSTANTS.REGEX.PHONE.test(value))
      return ERROR_MESSAGES.PHONE_INVALID;
    return undefined;
  },

  githubUrl: (value: string | undefined): string | undefined => {
    if (!value) return undefined;
    if (!VALIDATION_CONSTANTS.REGEX.GITHUB.test(value))
      return ERROR_MESSAGES.GITHUB_INVALID;
    return undefined;
  },

  // 비밀번호 재설정 관련 검증 함수
  verificationCode: (code: string): string | undefined => {
    if (!code) return ERROR_MESSAGES.CODE_REQUIRED;
    if (code.length !== VALIDATION_CONSTANTS.CODE.LENGTH)
      return ERROR_MESSAGES.CODE_LENGTH;
    return undefined;
  },

  newPassword: (password: string): string | undefined => {
    if (!password) return ERROR_MESSAGES.NEW_PASSWORD_REQUIRED;
    return userValidation.password(password);
  },

  confirmPassword: (
    password: string,
    confirmPassword: string
  ): string | undefined => {
    if (!confirmPassword) return ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED;
    if (password !== confirmPassword) return ERROR_MESSAGES.PASSWORD_MISMATCH;
    return undefined;
  },

  resetPasswordForm: (formData: {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
  }): string | undefined => {
    const emailError = userValidation.email(formData.email);
    if (emailError) return emailError;

    const codeError = userValidation.verificationCode(formData.code);
    if (codeError) return codeError;

    const passwordError = userValidation.newPassword(formData.newPassword);
    if (passwordError) return passwordError;

    const confirmError = userValidation.confirmPassword(
      formData.newPassword,
      formData.confirmPassword
    );
    if (confirmError) return confirmError;

    return undefined;
  },
};

export const loginValidation = {
  email: (value: string): string | undefined => {
    if (!value) return ERROR_MESSAGES.EMAIL_REQUIRED;
    return undefined;
  },

  password: (value: string): string | undefined => {
    if (!value) return ERROR_MESSAGES.PASSWORD_REQUIRED;
    return undefined;
  },
};

export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  return ERROR_MESSAGES.API_ERROR;
};
