import { PulseLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-[70%]">
      <PulseLoader color="#36d7b7" size={15} margin={5} />
    </div>
  );
}
