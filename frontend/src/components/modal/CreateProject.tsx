import { useState } from "react";
import { Modal } from "./config/ModalMaps";
import { ModalRootProps } from "@/types/modal";
import { project_image } from "@/data/project_image";
import { CreateProject } from "@/types/project";
import { useCreateProject } from "@/query/mutations/project";

export default function CreateProjectModal({
  isOpen,
  onClose,
}: ModalRootProps) {
  const createProjectMutation = useCreateProject();
  const [formData, setFormData] = useState<CreateProject>({
    title: "",
    description: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    project_image: project_image[0],
  });

  const [titleError, setTitleError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [endDateError, setEndDateError] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "title") {
      if (value.length > 50) {
        setTitleError("제목은 50자 이내로 작성해주세요.");
      } else {
        setTitleError("");
      }
    }

    if (name === "description") {
      if (value.length > 100) {
        setDescriptionError("설명은 100자 이내로 작성해주세요.");
      } else {
        setDescriptionError("");
      }
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedData = { ...prev, [name]: value };
      if (name === "start_date") {
        if (new Date(value) > new Date(prev.end_date)) {
          updatedData.end_date = value;
        }
      }
      if (name === "end_date") {
        if (new Date(value) < new Date(prev.start_date)) {
          return prev;
        }
      }
      return updatedData;
    });
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
      setFormData({ ...formData, project_image: fileUrl });
    }
  };

  const handleSubmit = async () => {
    try {
      setTitleError("");
      setDescriptionError("");
      setEndDateError("");

      if (!formData.title || formData.title.length > 50) {
        setTitleError("제목은 50자 이내로 작성해주세요. 🚨 ");
        return;
      }
      if (!formData.description || formData.description.length > 100) {
        setDescriptionError("설명은 100자 이내로 작성해주세요. 🚨");
        return;
      }
      if (!formData.end_date) {
        setEndDateError("마감일을 입력해주세요. 🚨");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("start_date", formData.start_date);
      formDataToSend.append("end_date", formData.end_date);

      const fileInput = document.getElementById(
        "project_image"
      ) as HTMLInputElement;
      let projectImage: File | string;

      if (fileInput?.files?.[0]) {
        projectImage = fileInput.files[0];
      } else {
        projectImage =
          formData.project_image !== project_image[0]
            ? formData.project_image
            : project_image[0];
      }

      formDataToSend.append("project_image", projectImage);
      createProjectMutation.mutate(formDataToSend);
      onClose();
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOutsideClick={false}>
      <div>
        <div className="flex justify-between items-center">
          <Modal.Title>프로젝트 생성</Modal.Title>
          <Modal.Button variant="nothing" onClick={onClose}>
            X
          </Modal.Button>
        </div>
        <Modal.Divider />
        <Modal.Subtitle>프로젝트 정보를 입력해주세요. 🚀</Modal.Subtitle>
        <span className="text-xs text-gray-400">
          생성 후 모든 사항이 변경 가능합니다.
        </span>
        <Modal.Divider />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 제목 입력 */}
          <div>
            <div className="flex items-center">
              <label className="block text-lg font-bold text-gray-700 pr-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-400">
                50자 이내로 작성해주세요. (필수)
              </span>
            </div>
            <Modal.Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="제목을 입력하세요"
              className="placeholder:text-sm placeholder:gray-400"
              required
            />
            {titleError && (
              <span className="text-red-500 text-sm">{titleError}</span>
            )}
          </div>

          {/* 설명 입력 */}
          <div>
            <div className="flex items-center">
              <label className="block text-lg font-bold text-gray-700 pr-2">
                설명
              </label>
              <span className="text-xs text-gray-400">
                100자 이내로 작성해주세요. (선택)
              </span>
            </div>
            <Modal.Input
              type="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="h-24 resize-none placeholder:text-sm placeholder:gray-400"
              placeholder="프로젝트에 대해 설명해주세요."
            />
            {descriptionError && (
              <span className="text-red-500 text-sm">{descriptionError}</span>
            )}
          </div>

          {/* 시작일, 마감일 입력 */}
          <div className="flex justify-between w-full">
            <div className="w-1/2 pr-2">
              <div className="flex items-center">
                <label className="block text-lg font-bold text-gray-700 pr-2">
                  시작일 <span className="text-red-500">*</span>
                </label>
              </div>
              <Modal.Input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleDateChange}
                required
              />
            </div>

            {/* 마감일 */}
            <div className="w-1/2 pl-2">
              <div className="flex items-center">
                <label className="block text-lg font-bold text-gray-700 pr-2">
                  마감일 <span className="text-red-500">*</span>
                </label>
              </div>
              <Modal.Input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleDateChange}
                min={formData.start_date}
                required
              />
              {endDateError && (
                <span className="text-red-500 text-sm">{endDateError}</span>
              )}
            </div>
          </div>

          {/* 프로젝트 이미지 선택 */}
          <div>
            <div className="flex items-center">
              <label className="block text-lg font-bold text-gray-700 pr-2">
                프로젝트 이미지 <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-400">
                이미지를 첨부하거나 원하는 이미지를 선택하세요. (5MB 이하 : jpg,
                png, jpeg)
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div className="w-24 h-24 relative border-2 border-blue-500 rounded-md overflow-hidden flex items-center justify-center">
                {formData.project_image && (
                  <img
                    src={
                      typeof formData.project_image === "string"
                        ? formData.project_image
                        : ""
                    }
                    alt="Preview"
                    className="object-fit w-full h-full"
                  />
                )}
              </div>
              <label
                htmlFor="project_image"
                className="w-24 h-24 border border-gray-300 rounded-md flex items-center justify-center cursor-pointer text-xl text-gray-300"
              >
                +
              </label>
              <input
                id="project_image"
                type="file"
                name="project_image"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {fileError && (
              <span className="text-red-500 text-sm mt-2">{fileError}</span>
            )}
          </div>

          {/* 프로젝트 이미지 목록 */}
          <div className="mt-4">
            <div className="p-4 rounded-lg max-w-full bg-gray-100 shadow-lg">
              <div className="flex flex-wrap gap-2 items-center justify-center">
                {project_image.map((image, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 relative rounded-md overflow-hidden cursor-pointer transform hover:scale-105 transition duration-200 ${
                      formData.project_image === image
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, project_image: image })
                    }
                  >
                    <img
                      src={image}
                      alt={`Project Image ${index}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Modal.Divider />

          <div className="flex justify-end space-x-2">
            <Modal.Button variant="secondary" onClick={onClose}>
              닫기
            </Modal.Button>
            <Modal.Button
              variant="primary"
              onClick={() => handleSubmit()}
              disabled={createProjectMutation.isPending}
            >
              {createProjectMutation.isPending ? "생성 중..." : "생성"}
            </Modal.Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
