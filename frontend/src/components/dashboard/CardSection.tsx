type CardSectionProps = {
  title: string;
  children: React.ReactNode;
};

export default function CardSection({ title, children }: CardSectionProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-[330px] max-h-[330px] overflow-y-auto">
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      <hr className="my-4" />
      {children}
    </div>
  );
}
