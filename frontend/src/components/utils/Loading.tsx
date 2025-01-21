import React from "react";
import { PulseLoader } from "react-spinners";

function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <PulseLoader color="#36d7b7" size={15} margin={5} />
    </div>
  );
}

export default Loading;
