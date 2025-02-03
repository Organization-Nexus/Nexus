import { useState, useEffect } from "react";
import { Modal } from "./config/ModalMaps";
import { ModalRootProps } from "@/types/modal";
import { PencilLine, X } from "lucide-react";
import { UnderlineInput } from "../ui/underlineInput";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/app/_api/models/user";
import { userValidation } from "@/utils/validators/userValidation";
import Image from "next/image";
import { PositionSelect } from "../user/PositionSelect";
import { UpdateUserDto, ValidationErrors } from "@/types/user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MyPageModal({ isOpen, onClose }: ModalRootProps) {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: userApi.getUser,
  });

  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<UpdateUserDto>({
    name: "",
    mainPosition: "",
    githubUrl: null,
    profileImage: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [fileError, setFileError] = useState<string>("");

  const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        mainPosition: user.mainPosition,
        githubUrl: user.githubUrl,
        profileImage: user.log.profileImage,
      });
    }
  }, [user]);

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
      const fileUrl = URL.createObjectURL(file);
      setFormData({ ...formData, profileImage: fileUrl });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    try {
      await userApi.updateUser(formData);
      await queryClient.invalidateQueries({ queryKey: ["user"] });
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
        profileImage: user.log.profileImage,
      });
    }

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

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
              {formData.profileImage && (
                <Image
                  src={
                    typeof formData.profileImage === "string"
                      ? formData.profileImage
                      : ""
                  }
                  alt="프로필"
                  width={150}
                  height={150}
                  className="justify-self-center w-20 h-20 rounded-2xl bg-custom-main"
                />
              )}
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
            <X onClick={onClose} className="cursor-pointer mr-4" />
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
                <label className="block text-md font-bold text-gray-700 pr-2">
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
                <div className="space-y-4">
                  <p className="text-xs text-gray-500 mt-3">
                    8~20자 영문, 숫자, 특수문자 조합
                  </p>
                  <div className="grid grid-cols-6">
                    <div className="  self-center">
                      <label className="text-sm font-bold text-gray-700">
                        현재 비밀번호
                      </label>
                    </div>
                    <div className="col-span-5">
                      <UnderlineInput
                        type="password"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            currentPassword: e.target.value,
                          }))
                        }
                        placeholder="현재 비밀번호를 입력해주세요"
                        className="p-0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-6">
                    <div className=" self-center">
                      <label className="text-sm font-bold text-gray-700">
                        새 비밀번호
                      </label>
                    </div>
                    <div className="col-span-5">
                      <UnderlineInput
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        placeholder="새 비밀번호를 입력해주세요"
                        className="p-0"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-6">
                    <div className="self-center">
                      <label className="text-sm font-bold text-gray-700">
                        비밀번호 확인
                      </label>
                    </div>
                    <div className="col-span-5">
                      <UnderlineInput
                        type="password"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        placeholder="비밀번호를 다시 입력해주세요"
                        className="p-0"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Modal.Button
                      variant="secondary"
                      onClick={() => setIsPasswordResetOpen(false)}
                      className="text-sm"
                    >
                      취소
                    </Modal.Button>
                    <Modal.Button
                      onClick={() => {
                        // 비밀번호 변경 로직 구현
                        console.log("비밀번호 변경");
                      }}
                      className="text-sm"
                    >
                      확인
                    </Modal.Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end p-4 pb-0 gap-2">
              <AlertDialog>
                <AlertDialogTrigger>
                  <Modal.Button variant="secondary" className="m-1 w-20">
                    취소
                  </Modal.Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>정말로 취소하시겠어요?</AlertDialogTitle>
                    <AlertDialogDescription>
                      확인 버튼을 누르시면 수정사항이 저장되지 않습니다.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClose}>
                      확인
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

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
