import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import pb from "@/lib/pocketbase";
import { useCurrentRound } from "@/hooks/useCurrentRound";

interface GamePlayer {
  id: string;
  player_id: string;
  score: number;
  expand?: {
    player_id?: {
      name: string;
    };
  };
}

const PlayersInGame = () => {
  const gameId = useGameStore((state) => state.gameId);
  const playerSubmitList = useGameStore((state) => state.playerSubmitList);
  const setPlayerState = useGameStore((state) => state.setPlayerState);
  const currentCzarId = useGameStore((state) => state.currentCardCzarId); 

  const [players, setPlayers] = useState<GamePlayer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!gameId) return;
  
    let unsubscribe: () => void;
  
    const fetchPlayers = async () => {
      try {
        const resultList = await pb
          .collection("game_players")
          .getList<GamePlayer>(1, 50, {
            filter: `game_id="${gameId}"`,
            expand: "player_id",
          });
        setPlayers(resultList.items);
      } catch (err) {
        console.error("Failed to fetch players:", err);
      }
    };
  
    const setupSubscription = async () => {
      await fetchPlayers();
  
      const unsub = await pb.collection("game_players").subscribe("*", (e) => {
        console.log("Subscription event:", e);
  
        if (e.action === "create" || e.action === "update" || e.action === "delete") {
          fetchPlayers();
        }
      }, {
        filter: `game_id="${gameId}"`,
      });
  
      unsubscribe = unsub;
    };
  
    setupSubscription();
  
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [gameId]);

  useEffect(() => {
    if (!players.length || !currentCzarId) return;
  
    const allSubmitted = players
      .filter((player) => player.player_id !== currentCzarId) // Exclude Czar
      .every((player) => playerSubmitList.includes(player.id)); // Check if each submitted
  
    if (allSubmitted) {
      console.log("✅ All players submitted! Moving to viewing_results");
      setPlayerState("viewing_results"); // 🧠 Update Zustand state
    }
  }, [players, playerSubmitList, currentCzarId, setPlayerState]);

  if (loading) {
    return <div>Loading players...</div>;
  }

  if (!gameId) {
    return <div>No game found.</div>;
  }

  return (
    <div className="w-[250px] p-4 border border-slate bg-red-400">
      <ul>
        {players.length === 0 && <li>No players found.</li>}
        {players.map((player) => {
          const isCzar = player.player_id === currentCzarId;
          const hasSubmitted = playerSubmitList.includes(player.id);
          return (
            <li key={player.id} className={isCzar ? "font-bold text-yellow-400" : ""}>
              {player.expand?.player_id?.name || "Unknown Player"} - {player.score}
              {isCzar && " 👑 (Czar)"}
              {hasSubmitted && (
                <span className="text-green-500 ml-2">✔️</span>
              )}
              <hr />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PlayersInGame;
