import { useState } from "react";
import { Modal } from "./config/ModalMaps";
import { PencilLine, X } from "lucide-react";
import { UnderlineInput } from "../ui/underlineInput";
import { userValidation } from "@/utils/validators/userValidation";
import Image from "next/image";
import { PositionSelect } from "../user/PositionSelect";
import { UpdateUserDto, User, ValidationErrors } from "@/types/user";
import { useUpdateUser } from "@/query/mutations/user";
import { CustomAlertDialog } from "../common/CustomAlertDialog";
import PasswordChangeForm from "../auth/PasswordChangeForm";

export interface MyPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export default function MyPageModal({
  isOpen,
  onClose,
  user,
}: MyPageModalProps) {
  const { mutate: updateUser } = useUpdateUser();

  const [formData, setFormData] = useState<UpdateUserDto>({
    name: user.name,
    mainPosition: user.mainPosition,
    githubUrl: user.githubUrl,
    profileImageUrl: user.log.profileImage,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [fileError, setFileError] = useState<string>("");

  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  // const [passwordForm, setPasswordForm] = useState({
  //   currentPassword: "",
  //   newPassword: "",
  //   confirmPassword: "",
  // });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // 실시간 유효성 검사
    if (name === "name") {
      const validationError = userValidation.name(value);
      setErrors((prev) => ({
        ...prev,
        name: validationError,
      }));
    }

    if (name === "githubUrl") {
      const validationError = userValidation.githubUrl(value);
      setErrors((prev) => ({
        ...prev,
        githubUrl: validationError,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      name: userValidation.name(formData.name),
      githubUrl: formData.githubUrl
        ? userValidation.githubUrl(formData.githubUrl)
        : undefined,
      mainPosition: !formData.mainPosition
        ? "포지션을 선택해주세요."
        : undefined,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== undefined);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError("파일 크기는 5MB 이하만 가능합니다.");
        return;
      }
      const fileType = file.type.split("/")[1].toLowerCase();
      if (!["jpg", "jpeg", "png"].includes(fileType)) {
        setFileError("jpg, png, jpeg 파일만 업로드 가능합니다.");
        return;
      }
      setFileError("");

      setFormData({
        ...formData,
        profileImage: file,
        profileImageUrl: undefined,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      console.log("🥲 FormData: ", formData);
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("mainPosition", formData.mainPosition);

      if (formData.githubUrl) {
        formDataToSend.append("githubUrl", formData.githubUrl);
      }

      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
        console.log("file형식으로 전송:", formData.profileImage);
      } else if (formData.profileImageUrl) {
        formDataToSend.append("profileImageUrl", formData.profileImageUrl);
        console.log("URL형식으로 전송:", formData.profileImageUrl);
      }
      updateUser(formDataToSend);

      onClose();
      alert("수정이 완료되었습니다.");
    } catch (err) {
      console.error("Update Error:", err);
      setErrors((prev) => ({
        ...prev,
        submit: "프로필 수정에 실패했습니다.",
      }));
    }
  };

  const handleClose = () => {
    if (user) {
      setFormData({
        name: user.name,
        mainPosition: user.mainPosition,
        githubUrl: user.githubUrl,
        profileImageUrl: user.log.profileImage,
      });
    }

    // setPasswordForm({
    //   currentPassword: "",
    //   newPassword: "",
    //   confirmPassword: "",
    // });

    // 비밀번호 재설정 모달 상태 초기화
    setIsPasswordResetOpen(false);

    // 에러 상태들 초기화
    setErrors({});
    setFileError("");

    // 모달 닫기
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      closeOnOutsideClick={false}
      className="p-0 px-0 py-0"
    >
      <div className="flex">
        <div className="basis-1/4">
          <div className=" h-20 bg-custom-gray rounded-tl-2xl p-6">
            <div className="relative ml-6 mr-10">
              {formData.profileImage ? (
                <Image
                  src={URL.createObjectURL(formData.profileImage)}
                  alt="프로필"
                  width={150}
                  height={150}
                  className="justify-self-center w-20 h-20 min-w-20 min-h-20 rounded-2xl bg-custom-main"
                />
              ) : formData.profileImageUrl ? (
                <Image
                  src={formData.profileImageUrl}
                  alt="프로필"
                  width={150}
                  height={150}
                  className="justify-self-center w-20 h-20 min-w-20 min-h-20 rounded-2xl bg-custom-main"
                />
              ) : null}
              <label
                htmlFor="profile-image-input"
                className="absolute right-0 top-3/4 border-2 border-white h-8 w-8 rounded-full bg-custom-smallText flex items-center justify-center cursor-pointer hover:bg-gray-600"
              >
                <PencilLine className="h-4 w-4 text-white hover:text-black" />
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
            {fileError && (
              <span className="text-red-500 text-sm mt-2">{fileError}</span>
            )}
          </div>
        </div>

        <div className="basis-3/4">
          <div className="h-20 bg-custom-gray rounded-tr-2xl p-6 flex justify-between items-center">
            <Modal.Title className="text-2xl font-bold mb-0">
              마이페이지
            </Modal.Title>
            <CustomAlertDialog
              onConfirm={handleClose}
              title="창을 닫을까요?"
              description="확인 버튼을 누르시면 수정사항이 저장되지 않습니다."
            >
              <X className="cursor-pointer mr-4" />
            </CustomAlertDialog>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6 mr-4">
            <div>
              <label className="block text-md font-bold text-gray-700 pr-2">
                이메일
              </label>
              <UnderlineInput disabled value={user?.email} className="p-0" />
            </div>
            <div>
              <label className="block text-md font-bold text-gray-700 pr-2">
                이름
              </label>
              <UnderlineInput
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="p-0"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-md font-bold text-gray-700 pr-2">
                전화번호
              </label>
              <UnderlineInput
                disabled
                value={user?.phoneNumber}
                onChange={handleChange}
                className="p-0"
              />
            </div>
            <div>
              <label className="block text-md font-bold text-gray-700 pr-2">
                Github
              </label>
              <div className="flex items-center gap-2">
                <UnderlineInput
                  name="githubUrl"
                  value={formData.githubUrl || ""}
                  onChange={handleChange}
                  className="p-0"
                />
              </div>
              {errors.githubUrl && (
                <p className="text-red-500 text-sm mt-1">{errors.githubUrl}</p>
              )}
            </div>
            <div>
              <label className="block text-md font-bold text-gray-700 pr-2 mb-3">
                주포지션
              </label>
              <PositionSelect
                onSelectPosition={(position) =>
                  setFormData((prev) => ({ ...prev, mainPosition: position }))
                }
                currentPosition={formData.mainPosition}
                className="[&>button]:px-3.5 [&>button]:py-1.5"
              />
              {errors.mainPosition && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mainPosition}
                </p>
              )}
            </div>

            <div>
              <div className="justify-items-start">
                <label className="block text-md font-bold text-gray-700 pr-2 mb-1">
                  비밀번호
                </label>
                {!isPasswordResetOpen && (
                  <Modal.Button
                    onClick={() => setIsPasswordResetOpen(!isPasswordResetOpen)}
                    variant="secondary"
                    className="m-2 text-custom-smallText text-sm"
                  >
                    비밀번호 재설정
                  </Modal.Button>
                )}
              </div>
              {/* 비밀번호 재설정 폼 */}
              <div
                className={`
                  grid overflow-hidden transition-all duration-500 ease-in-out
                  ${
                    isPasswordResetOpen
                      ? "grid-rows-[1fr] max-h-[550px] opacity-100"
                      : "grid-rows-[0fr] max-h-0 opacity-0"
                  }
                `}
              >
                <div className="min-h-0">
                  {isPasswordResetOpen && (
                    <PasswordChangeForm
                      onClose={() => setIsPasswordResetOpen(false)}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end p-4 pb-0 gap-2">
              <CustomAlertDialog
                onConfirm={handleClose}
                title="정말로 취소하시겠어요?"
                description="확인 버튼을 누르시면 수정사항이 저장되지 않습니다."
              >
                <Modal.Button variant="secondary" className="m-1 w-20">
                  취소
                </Modal.Button>
              </CustomAlertDialog>

              <Modal.Button type="submit" className="m-1 w-20">
                수정
              </Modal.Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
