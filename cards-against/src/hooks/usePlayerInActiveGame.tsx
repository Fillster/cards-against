import { useEffect, useState } from "react";
import pb from "../lib/pocketbase";
import usePlayerLobbyStore from "../store/playerLobbyStore";

export function usePlayerInActiveGame() {
  const { playerId } = usePlayerLobbyStore();
  const [playerInActiveGame, setPlayerInActiveGame] = useState<boolean>(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const checkPlayerInActiveGame = async () => {
      try {
        const records = await pb.collection("game_players").getFullList({
          filter: `player_id = "${playerId}"`,
        });
        setPlayerInActiveGame(records.length > 0);
      } catch (error) {
        console.error("Error checking player in active game:", error);
      }
    };

    const setupSubscription = async () => {
      try {
        unsubscribe = await pb
          .collection("game_players")
          .subscribe("*", (e) => {
            if (e.record.player_id === playerId) {
              if (e.action === "create" || e.action === "update") {
                setPlayerInActiveGame(true);
              } else if (e.action === "delete") {
                setPlayerInActiveGame(false);
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
