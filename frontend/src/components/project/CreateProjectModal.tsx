import { useState } from "react";
import { Modal } from "../modal/Modal";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectFormData {
  title: string;
  description: string;
  start_date: string;
  end_date: string;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
}: CreateProjectModalProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // API 호출 로직
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-[500px]">
        <Modal.Title className="text-lg font-medium mb-4">
          Create Project
        </Modal.Title>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              제목
            </label>
            <Modal.Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              설명
            </label>
            <Modal.Input
              type="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="h-24 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              시작 날짜
            </label>
            <Modal.Input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              종료 날짜
            </label>
            <Modal.Input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              min={formData.start_date}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Modal.Button
              variant="secondary"
              onClick={onClose}
              className="px-4 py-2 text-sm"
            >
              취소
            </Modal.Button>
            <Modal.Button
              variant="primary"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600"
            >
              생성
            </Modal.Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
