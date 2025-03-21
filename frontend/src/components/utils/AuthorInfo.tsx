// AuthorInfo.tsx
interface AuthorInfoProps {
  profileImage: string;
  name: string;
  position: string;
}

const AuthorInfo = ({ profileImage, name, position }: AuthorInfoProps) => {
  return (
    <div className="flex items-center space-x-4">
      <img
        src={profileImage}
        alt={name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">{position}</p>
      </div>
    </div>
  );
};

export default AuthorInfo;
