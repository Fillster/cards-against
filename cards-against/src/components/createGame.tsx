import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useGameStore } from "@/store/useGameStore";
import { useCreateAndStartGame } from "@/hooks/useCreateAndStartGame";

const CreateGame = () => {
  const playerId = useGameStore((state) => state.playerId); 
  const [gameName, setGameName] = useState("");
  const { mutate: startGame, isPending, error } = useCreateAndStartGame();

  const handleCreateGame = () => {
    if (!playerId) {
      console.error("❌ Player ID is required.");
      return;
    }
    startGame({ playerId, gameName });
  };

  return (
    <div className="flex flex-col gap-2 pt-2 justify-end">
      <Input
        type="text"
        value={gameName}
        onChange={(e) => setGameName(e.target.value)}
        placeholder="Game name"
        className="w-34"
      />
      <Button onClick={handleCreateGame} disabled={isPending}>
        {isPending ? "Creating..." : "Create Game"}
      </Button>
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </div>
  );
};

export default CreateGame;
