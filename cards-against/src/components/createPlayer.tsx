import React, { useState, useEffect } from "react";
import pb from "@/lib/pocketbase";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
// Define TypeScript interface for the data
interface Player {
  name: string;
}

const CreatePlayer: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>(
    localStorage.getItem("playerName") || ""
  ); // Default to an empty string if localStorage is null
  const [playerName2, setPlayerName2] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for playerName on component mount
    const storedPlayerName = localStorage.getItem("playerName");
    if (storedPlayerName) {
      setPlayerName2(storedPlayerName);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const createPlayer = async () => {
    if (!playerName) {
      setResponseMessage("Player name is required.");
      return;
    }

    try {
      // Check if the player name already exists
      const existingPlayers = await pb.collection("player").getList(1, 1, {
        filter: `name="${playerName}"`, // Filter players with the same name
      });

      if (existingPlayers.totalItems > 0) {
        setResponseMessage("Player name already exists.");
        return;
      }

      const data: Player = {
        name: playerName, // Guaranteed to be a string
      };

      const record = await pb.collection("player").create(data);

      // Set the player name in localStorage after successful creation
      localStorage.setItem("playerName", playerName);
      localStorage.setItem("playerId", record.id);
      console.log(record.id);
      setPlayerName2(playerName);

      setResponseMessage(`Player created with ID: ${record.id}`);
    } catch (error: any) {
      setResponseMessage(`Error creating player: ${error.message}`);
    }
  };

  const onNameChange = () => {
    setPlayerName2("");
  };
  // Check if playerName is already set
  if (playerName2) {
    return (
      <div>
        <Button onClick={onNameChange}>Change Name</Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-2 w-96 p-4 border border-slate-300 rounded-sm">
        <h1 className="text-white">Player name:</h1>
        <div className="">
          <Input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter player name"
          />
        </div>
        <div className="self-end">
          <Button onClick={createPlayer}>Create Player</Button>
        </div>
      </div>

      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default CreatePlayer;
