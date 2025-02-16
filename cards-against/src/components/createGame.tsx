import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import usePlayerLobbyStore from "@/store/playerLobbyStore";
import { useCreateGame } from "@/hooks/useCreateGame";
import { useJoinGame } from "@/hooks/useJoinGame";

const CreateGame = () => {
  const { playerId } = usePlayerLobbyStore();
  const [gameName, setGameName] = useState("");

  const {
    mutate: createGame,
    status: createStatus,
    error: createError,
  } = useCreateGame();
  const {
    mutate: joinGame,
    status: joinStatus,
    error: joinError,
  } = useJoinGame();

  const isCreating = createStatus === "pending";
  const isJoining = joinStatus === "pending";

  const handleCreateGame = async () => {
    if (!playerId) {
      console.error("Player ID is required to create a game.");
      return;
    }

    createGame(
      { playerId, name: gameName, status: "active" },
      {
        onSuccess: (gameId) => {
          // Once the game is created successfully, join it
          joinGame({ gameId, playerId, score: 0 });
        },
      }
    );
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
      <Button onClick={handleCreateGame} disabled={isCreating || isJoining}>
        {isCreating ? "Creating..." : isJoining ? "Joining..." : "Create Game"}
      </Button>
      {createError && <p>Error creating game: {createError.message}</p>}
      {joinError && <p>Error joining game: {joinError.message}</p>}
    </div>
  );
};

export default CreateGame;
