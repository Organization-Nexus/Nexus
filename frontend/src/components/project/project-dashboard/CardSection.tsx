type CardSectionProps = {
  title: string;
  children: React.ReactNode;
};

const CardSection = ({ title, children }: CardSectionProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md min-h-[350px] max-h-[350px] overflow-y-auto">
    <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
    <hr className="my-4" />
    {children}
  </div>
);

export default CardSection;
