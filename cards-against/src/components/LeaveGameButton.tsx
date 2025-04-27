import { Button } from "./ui/button";
import usePlayerLobbyStore from "@/store/playerLobbyStore";
import { useLeaveGame } from "@/hooks/useLeaveGame";
import { useGameStore } from "@/store/useGameStore";

const LeaveGameButton = () => {
 // const { playerId, playerGameId } = usePlayerLobbyStore();
  const gameId = useGameStore((state) => state.gameId)
  const playerId = useGameStore((state) => state.playerId)
  const { mutate: leaveGame, status } = useLeaveGame();

  const isLeaving = status === "pending"; // ✅ React Query v5 uses `status`

  const handleLeaveGame = () => {
    if (!playerId || !gameId) return;
    leaveGame(playerId);
  };

  return (
    <Button onClick={handleLeaveGame} disabled={isLeaving || !gameId}>
      {isLeaving ? "Leaving..." : "Leave Game"}
    </Button>
  );
};

export default LeaveGameButton;
