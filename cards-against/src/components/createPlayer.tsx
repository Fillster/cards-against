import React, { useState } from "react";
import pb from "@/lib/pocketbase";
// Initialize PocketBase

// Define TypeScript interface for the data
interface Player {
  name: string;
}

const CreatePlayer: React.FC = () => {
  const [playerName, setPlayerName] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const createPlayer = async () => {
    const data: Player = {
      name: playerName,
    };

    try {
      const record = await pb.collection("player").create(data);
      setResponseMessage(`Player created with ID: ${record.id}`);
    } catch (error) {
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
