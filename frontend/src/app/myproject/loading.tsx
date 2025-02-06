import { FadeLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-black bg-opacity-50">
      <FadeLoader color="#36d7b7" />
    </div>
  );
}
