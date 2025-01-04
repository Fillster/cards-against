import { useEffect, useState } from "react";
import usePlayerLobbyStore from "@/store/playerLobbyStore";
import pb from "@/lib/pocketbase";

interface GamePlayer {
  id: string;
  player_id: string;
  score: number;
  expand?: {
    player_id?: {
      name: string; // Name field from the players collection
    };
  };
}

const PlayersInGame = () => {
  const { playerGameId } = usePlayerLobbyStore();
  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!playerGameId) {
        console.log("No game ID available, skipping fetch.");
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
      console.log("Fetching players for game ID:", playerGameId);
      setLoading(true);

      try {
        const resultList = await pb
          .collection("game_players")
          .getList<GamePlayer>(1, 50, {
            filter: `game_id="${playerGameId}"`,
            expand: "player_id", // Include related player data
          });
        console.log("Fetched players:", resultList.items);
        setPlayers(resultList.items);
      } catch (err) {
        console.error("Failed to fetch players:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [playerGameId]); // Only runs when `playerGameId` changes

  if (loading) {
    return <div>Loading players...</div>;
  }

  if (!playerGameId) {
    return <div>No game found.</div>;
  }

  return (
    <div className="w-[250px] p-4 border border-slate bg-red-400">
      <ul>
        {players.length === 0 && <li>No players found.</li>}
        {players.map((player) => (
          <li key={player.id}>
            {player.expand?.player_id?.name || "Unknown Player"}{" "}
            {" " & player.score}
            <hr></hr>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlayersInGame;
