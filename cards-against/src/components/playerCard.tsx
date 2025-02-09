import React from "react";

interface PlayerCardProps {
  text: string;
  type: "black" | "white";
}

const PlayerCard: React.FC<PlayerCardProps> = ({ text, type }) => {
  console.log(type);
  return (
    <div
      className={`w-[200px] p-4 h-[240px] border-2 rounded hover:scale-110 transition-transform ${
        type === "black"
          ? "bg-black text-white border-slate-900"
          : "bg-white text-black border-gray-300"
      }`}
    >
      <p>{text}</p>
    </div>
  );
};

export default PlayerCard;
