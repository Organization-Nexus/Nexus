import { UpdateCommunity } from "@/types/modal";
import { Modal } from "../config/ModalMaps";

export default function UpdateCommunityModal({
  isOpen,
  onClose,
  projectId,
  feedId,
  updateData,
}: UpdateCommunity) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {feedId}
    </Modal>
  );
}
