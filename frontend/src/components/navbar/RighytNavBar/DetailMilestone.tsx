import { format } from "date-fns";
import { Target, FileText, NotebookPen, X } from "lucide-react";
import { Modal } from "@/components/modal/config/ModalMaps";
import { Milestone } from "@/types/milestone";

interface DetailMilestoneProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone | null;
}

export default function DetailMilestone({
  isOpen,
  onClose,
  milestone,
}: DetailMilestoneProps) {
  if (!milestone) return null;
  console.log(milestone);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col p-4">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center">
              <h1 className="text-2xl font-bold">{milestone.title}</h1>
              <span className="ml-4 bg-custom-point text-white rounded-xl px-4 py-1 text-sm">
                {milestone.category === "FE" ? "Frontend" : "Backend"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-gray-100 p-1 rounded-md transition"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <div className="flex gap-4 text-sm text-gray-600 mt-4 ml-1">
            <div>
              <span className="font-semibold text-custom-point">시작일: </span>
              {format(new Date(milestone.start_date), "yyyy-MM-dd")}
            </div>
            <div>
              <span className="font-semibold text-custom-point">마감일: </span>
              {format(new Date(milestone.end_date), "yyyy-MM-dd")}
            </div>
          </div>
        </div>

        <hr className="border-gray-300 my-4" />

        <div className="overflow-y-auto space-y-6">
          <section>
            <div className="flex items-center mb-2">
              <Target className="mr-2 w-4 h-4" />
              <h3 className="font-semibold">목표</h3>
            </div>
            <p className="pl-6 whitespace-pre-wrap text-gray-800">
              {milestone.goal}
            </p>
          </section>

          <section>
            <div className="flex items-center mb-2">
              <FileText className="mr-2 w-4 h-4" />
              <h3 className="font-semibold">상세 내용</h3>
            </div>
            <p className="pl-6 whitespace-pre-wrap text-gray-800">
              {milestone.content}
            </p>
          </section>

          {milestone.note && (
            <section>
              <div className="flex items-center mb-2">
                <NotebookPen className="mr-2 w-4 h-4" />
                <h3 className="font-semibold">참고 사항</h3>
              </div>
              <p className="pl-6 whitespace-pre-wrap text-gray-800">
                {milestone.note}
              </p>
            </section>
          )}
        </div>
      </div>
    </Modal>
  );
}
