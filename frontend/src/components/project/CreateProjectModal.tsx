import { ModalDetailProps } from "@/types/modal";
import { formatDate } from "@/utils/dateFormatter";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";

const CreateProjectModal = ({ closeModal, label }: ModalDetailProps) => {
  const formDate = formatDate(new Date().toISOString());

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: formDate,
    end_date: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevState) => {
      if (name === "start_date" && value !== prevState.start_date) {
        return {
          ...prevState,
          [name]: value,
          end_date: "",
        };
      }

      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    closeModal();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-w-4xl h-[600px] overflow-auto">
      <h2 className="text-xl font-semibold mb-4">{label}</h2>
      <hr className="my-4" />
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full placeholder:text-sm"
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            설명
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="start_date"
            className="block text-sm font-medium text-gray-700"
          >
            시작 날짜
          </label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
            min={formDate}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="end_date"
            className="block text-sm font-medium text-gray-700"
          >
            종료 날짜
          </label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            required
            min={formData.start_date}
          />
        </div>
        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={closeModal}
            className="bg-gray-500 text-white py-2 px-4 rounded-md"
          >
            취소
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            생성
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProjectModal;
