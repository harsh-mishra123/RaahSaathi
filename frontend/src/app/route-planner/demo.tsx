import { useState } from "react";
import CTACard from "@/components/ui/cta-card-1";

export function Demo() {
  const [selectedVariant, setSelectedVariant] = useState<
    "light" | "dark" | "gradient"
  >("light");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full mb-8">
        <div className="flex justify-center mb-8 space-x-4">
          <button
            onClick={() => setSelectedVariant("light")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedVariant === "light"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-800 hover:bg-gray-200"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setSelectedVariant("dark")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedVariant === "dark"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-800 hover:bg-gray-200"
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => setSelectedVariant("gradient")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedVariant === "gradient"
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-800 hover:bg-gray-200"
            }`}
          >
            Gradient
          </button>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <CTACard variant={selectedVariant} />
      </div>
    </div>
  );
}