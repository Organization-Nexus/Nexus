import { useState } from "react";
import { Modal } from "./config/ModalMaps";
import { ModalRootProps } from "@/types/modal";
import { ProjectBase } from "@/types/project";
import { project_image } from "@/data/project_image";
import { projectApi } from "@/api/project";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateProjectModal({
  isOpen,
  onClose,
}: ModalRootProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ProjectBase>({
    title: "",
    description: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
    project_image: project_image[0],
  });

  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("파일 크기는 5MB 이하만 가능합니다.");
        return;
      }
      const fileType = file.type.split("/")[1].toLowerCase();
      if (!["jpg", "jpeg", "png"].includes(fileType)) {
        setError("jpg, png, jpeg 파일만 업로드 가능합니다.");
        return;
      }
      setError("");
      const fileName = file.name.split(".")[0];
      setFormData({ ...formData, project_image: fileName });
    }
  };

  const handleSubmit = async () => {
    try {
      await projectApi.createProject(formData);
      queryClient.invalidateQueries({ queryKey: ["projectList"] });
      onClose();
    } catch (err) {
      setError("프로젝트 생성에 실패했습니다.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="flex justify-between items-center">
          <Modal.Title>프로젝트 생성</Modal.Title>
          <Modal.Button variant="nothing" onClick={onClose}>
            X
          </Modal.Button>
        </div>
        <Modal.Subtitle>프로젝트 정보를 입력해주세요.</Modal.Subtitle>
        <Modal.Divider />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 제목 입력 */}
          <div>
            <div className="flex items-center">
              <label className="block text-lg font-bold text-gray-700 pr-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-gray-400">
                10자 이내로 작성해주세요. (필수)
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
          </div>

          {/* 시작일, 마감일 입력 */}
          <div className="flex justify-between w-full">
            {/* 시작일 */}
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
                onChange={handleChange}
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
                onChange={handleChange}
                min={formData.start_date}
                required
              />
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
                    src={formData.project_image}
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
            {error && (
              <span className="text-red-500 text-sm mt-2">{error}</span>
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
              취소
            </Modal.Button>
            <Modal.Button variant="primary" onClick={() => handleSubmit()}>
              생성
            </Modal.Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
