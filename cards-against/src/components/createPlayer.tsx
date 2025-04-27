import React, { useState } from "react";
import pb from "@/lib/pocketbase";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useGameStore } from "@/store/useGameStore"; // 👈 import the Zustand store

interface Player {
  name: string;
}

const CreatePlayer: React.FC = () => {
  const playerName = useGameStore((state) => state.playerName);
  const setPlayerName = useGameStore((state) => state.setPlayerName);
  const setPlayerId = useGameStore((state) => state.setPlayerId);
  const reset = useGameStore((state) => state.resetState);
  const [inputName, setInputName] = useState("");

  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const createPlayer = async () => {
    if (!inputName.trim()) {
      setResponseMessage("Player name is required.");
      return;
    }

    try {
      const existingPlayers = await pb.collection("player").getList(1, 1, {
        filter: `name="${inputName}"`,
      });

      if (existingPlayers.totalItems > 0) {
        setResponseMessage("Player name already exists.");
        return;
      }

      const data: Player = { name: inputName };
      const record = await pb.collection("player").create(data);

      // ✅ Store into Zustand (which also persists)
      setPlayerName(inputName);
      setPlayerId(record.id);

      setResponseMessage(`Player created with ID: ${record.id}`);
    } catch (error: any) {
      setResponseMessage(`Error creating player: ${error.message}`);
    }
  };

  const onChangeName = () => {
  //  setPlayerName(null);
    //setPlayerId(null);
    //setInputName("");
    reset()
  };

  // ✅ If player already created, just show "Change Name" button
  if (playerName) {
    return (
      <div>
        <Button onClick={onChangeName}>Change Name</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-2 w-96 p-4 border border-slate-300 rounded-sm">
        <h1 className="text-white">Player name:</h1>
        <Input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Enter player name"
        />
        <div className="self-end">
          <Button onClick={createPlayer}>Create Player</Button>
        </div>
      </div>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default CreatePlayer;
