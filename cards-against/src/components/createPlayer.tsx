import React, { useState } from "react";
import pb from "@/lib/pocketbase";

// Define TypeScript interface for the data
interface Player {
  name: string;
}

const CreatePlayer: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>(
    localStorage.getItem('playerName') || ""
  ); // Default to an empty string if localStorage is null
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const createPlayer = async () => {
    if (!playerName) {
      setResponseMessage("Player name is required.");
      return;
    }

    const data: Player = {
      name: playerName, // Guaranteed to be a string
    };

    try {
      const record = await pb.collection("player").create(data);

      // Set the player name in localStorage after successful creation
      localStorage.setItem('playerName', playerName);
      localStorage.setItem('playerId', record.id);
      console.log(record.id);

      setResponseMessage(`Player created with ID: ${record.id}`);
    } catch (error: any) {
      setResponseMessage(`Error creating player: ${error.message}`);
    }
  };

  return (
    <div>
      <h1>Create Player</h1>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter player name"
      />
      <button onClick={createPlayer}>Create Player</button>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default CreatePlayer;
