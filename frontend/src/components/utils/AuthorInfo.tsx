import Image from "next/image";

interface AuthorInfoProps {
  profileImage: string;
  name: string;
  position?: string;
  isAuthor?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  type: string;
}

export default function AuthorInfo({
  profileImage,
  name,
  position,
  isAuthor = false,
  onEdit,
  onDelete,
  type,
}: AuthorInfoProps) {
  return (
    <div className="flex items-start space-x-4">
      {/* 프로필 이미지 */}
      <Image
        src={profileImage}
        alt={name}
        width={50}
        height={50}
        className="rounded-lg"
      />

      {/* 이름 및 직책 */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xl font-semibold">{name}</p>
            {position && <p className="text-sm text-gray-500">{position}</p>}
          </div>

          {/* 수정 및 삭제 버튼 */}
          {isAuthor && (
            <div className="flex space-x-2">
              {type !== "투표" && onEdit && (
                <button
                  onClick={onEdit}
                  className="text-gray-500 hover:underline text-sm"
                >
                  수정
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="text-gray-500 hover:underline text-sm"
                >
                  삭제
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
