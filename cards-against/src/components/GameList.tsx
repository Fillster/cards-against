import { Button } from "./ui/button";
import { useGames } from "@/hooks/useGames";
import { useJoinGame } from "@/hooks/useJoinGame";
import { useGameStore } from "@/store/useGameStore";


const GameList = () => {
  const { data: games, isLoading, error } = useGames();
  const { mutate: joinGame, status } = useJoinGame();
  const playerId = useGameStore((state) => state.playerId); 

  const isJoining = status === "pending";

  if (isLoading) return <p>Loading games...</p>;
  if (error) return <p>Error fetching games.</p>;
  if (!games?.length) return <p>No active games available.</p>;

  return (
    <div className="flex flex-col gap-2">
      {games.map((game) => (
        <div
          key={game.id}
          className="flex justify-between items-center p-2 border rounded-md"
        >
          <p className="text-lg">
            {game.name} (Host: {game.host_id})
          </p>
          <Button
            onClick={() => joinGame({ gameId: game.id, playerId, score: 0 })}
            disabled={isJoining || !playerId}
          >
            {isJoining ? "Joining..." : "Join"}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default GameList;
