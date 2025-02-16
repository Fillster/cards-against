import { Button } from "./ui/button";
import usePlayerLobbyStore from "@/store/playerLobbyStore";
import { useLeaveGame } from "@/hooks/useLeaveGame";

const LeaveGameButton = () => {
  const { playerId, playerGameId } = usePlayerLobbyStore();
  const { mutate: leaveGame, status } = useLeaveGame();

  const isLeaving = status === "pending"; // ✅ React Query v5 uses `status`

  const handleLeaveGame = () => {
    if (!playerId || !playerGameId) return;
    leaveGame(playerId);
  };

  return (
    <Button onClick={handleLeaveGame} disabled={isLeaving || !playerGameId}>
      {isLeaving ? "Leaving..." : "Leave Game"}
    </Button>
  );
};

export default LeaveGameButton;
