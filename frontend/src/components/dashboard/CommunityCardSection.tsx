type CardSectionProps = {
  projectId: string;
  title: string;
};

export default function CommunityCardSection({
  projectId,
  title,
}: CardSectionProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      <hr className="my-4" />
      커뮤니티
    </div>
  );
}
