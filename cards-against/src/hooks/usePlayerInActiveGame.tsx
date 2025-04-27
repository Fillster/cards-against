import { useEffect, useState } from "react";
import pb from "../lib/pocketbase";

import { useGameStore } from "@/store/useGameStore";

export function usePlayerInActiveGame() {
 // const { playerId, setPlayerGameId } = usePlayerLobbyStore();
  const { setGamePlayerId, setGameId, playerId } = useGameStore();
  const [playerInActiveGame, setPlayerInActiveGame] = useState<boolean>(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const checkPlayerInActiveGame = async () => {
      try {
        const records = await pb.collection("game_players").getFullList({
          filter: `player_id = "${playerId}"`,
        });

        if (records.length > 0) {
          setPlayerInActiveGame(true);
          setGameId(records[0].game_id);
          setGamePlayerId(records[0].id); // Set the game_players row ID
          console.log("added gameID:", records[0].game_id, "gamePlayerId:", records[0].id);
        } else {
          setPlayerInActiveGame(false);
          setGameId("");
          setGamePlayerId("");
        }
      } catch (error) {
        console.error("Error checking player in active game:", error);
      }
    };

    const setupSubscription = async () => {
      try {
        unsubscribe = await pb.collection("game_players").subscribe("*", (e) => {
          if (e.record.player_id === playerId) {
            if (e.action === "create" || e.action === "update") {
              setPlayerInActiveGame(true);
              setGameId(e.record.game_id);
              setGamePlayerId(e.record.id); // Set the game_players row ID
              console.log("added gameID:", e.record.game_id, "gamePlayerId:", e.record.id);
            } else if (e.action === "delete") {
              setPlayerInActiveGame(false);
              setGameId("");
              setGamePlayerId("");
            }
          }
        });
      } catch (error) {
        console.error("Error setting up subscription:", error);
      }
    };

    // Initial check
    checkPlayerInActiveGame();

    // Setup subscription
    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [playerId]);

  return playerInActiveGame;
}
