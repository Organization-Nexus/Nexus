import { LikeDataResponse } from "@/types/community";
import { Modal } from "../config/ModalMaps";
import { X } from "lucide-react";

export interface LikeListProps {
  isOpen: boolean;
  onClose: () => void;
  likeList: LikeDataResponse[];
}

export default function LikeList({ isOpen, onClose, likeList }: LikeListProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOutsideClick={true}
      className="w-[20%] max-w-lg bg-white rounded-lg shadow-lg p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <Modal.Title className="text-xl font-semibold text-gray-800">
          좋아요 목록
        </Modal.Title>
        <Modal.Button variant="nothing" onClick={onClose}>
          <X />
        </Modal.Button>
      </div>
      <div className="my-2">
        <Modal.Divider />
      </div>
      <div className="space-y-4 mt-4">
        {likeList.map((user) => (
          <div key={user.id} className="flex items-center space-x-4">
            <img
              src={user.profileImage}
              alt={user.name}
              className="w-10 h-10 rounded-full"
            />
            <p>{user.name}</p>
          </div>
        ))}
      </div>
    </Modal>
  );
}
