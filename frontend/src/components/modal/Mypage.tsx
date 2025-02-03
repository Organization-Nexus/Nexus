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
import { UpdateUserDto, ValidationErrors } from "@/types/User";

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
      console.log("전송 데이터 상세:", {
        formData,
      });
      await userApi.updateUser(formData);
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      console.log("수정완료");
      onClose();
    } catch (err) {
      console.error("Update Error:", err);
      setErrors((prev) => ({
        ...prev,
        submit: "프로필 수정에 실패했습니다.",
      }));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="p-0 px-0 py-0">
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
            <X onClick={onClose} className="cursor-pointer" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6">
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
                {/* {formData.githubUrl && formData.githubUrl !== "" && (
                  <ExternalLink
                    className="w-5 h-5 cursor-pointer text-gray-500 hover:text-custom-point"
                    onClick={() => {
                      if (formData.githubUrl) {
                        window.open(
                          formData.githubUrl,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }
                    }}
                  />
                )} */}
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
            <div className="justify-items-start">
              <label className="block text-md font-bold text-gray-700 pr-2">
                비밀번호
              </label>
              <Modal.Button
                onClick={() => {}}
                variant="secondary"
                className="m-2 text-custom-smallText text-sm"
              >
                비밀번호 재설정
              </Modal.Button>
            </div>
            <div className="flex justify-end p-4 pb-0 gap-2">
              <Modal.Button
                variant="secondary"
                onClick={onClose}
                className="m-1 w-20"
              >
                취소
              </Modal.Button>

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
