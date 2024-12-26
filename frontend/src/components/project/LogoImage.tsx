import { logoImages } from "@/data/LogoImage";
import React, { useState } from "react";

interface LogoImageProps {
  onLogoSelect: (logo: string | null) => void;
}

const LogoImage: React.FC<LogoImageProps> = ({ onLogoSelect }) => {
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [customLogo, setCustomLogo] = useState<File | null>(null);

  const handleLogoSelect = (image: string) => {
    setSelectedLogo(image);
    setCustomLogo(null);
    onLogoSelect(image);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setCustomLogo(file);
      setSelectedLogo(null);
      onLogoSelect(URL.createObjectURL(file));
    }
  };

  return (
    <div>
      <div className="flex gap-4">
        {logoImages.map((imageUrl, index) => (
          <div
            key={index}
            className={`w-12 h-12 border-2 rounded-lg cursor-pointer ${
              selectedLogo === imageUrl ? "border-blue-500" : "border-gray-300"
            }`}
            onClick={() => handleLogoSelect(imageUrl)}
          >
            <img
              src={imageUrl}
              alt={`Logo ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 mt-2"
        />
      </div>

      <div className="mt-4">
        {selectedLogo && !customLogo ? (
          <div>
            <h3 className="font-semibold">Selected Logo:</h3>
            <img
              src={selectedLogo}
              alt="Selected Logo"
              className="w-24 h-24 object-cover"
            />
          </div>
        ) : customLogo ? (
          <div>
            <h3 className="font-semibold">Custom Logo:</h3>
            <img
              src={URL.createObjectURL(customLogo)}
              alt="Custom Logo"
              className="w-24 h-24 object-cover"
            />
          </div>
        ) : (
          <p>No logo selected</p>
        )}
      </div>
    </div>
  );
};

export default LogoImage;
