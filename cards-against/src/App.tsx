import "./App.css";

import LobbyList from "./components/lobbyList";
import CreatePlayer from "./components/createPlayer";
import LoggedInUser from "./components/loggedInUser";
import PlayerLobbyFetcher from "./components/playerLobbyFetcher";
import { useEffect, useState } from "react";
import pb from "./lib/pocketbase";
import usePlayerLobbyStore from "./store/playerLobbyStore";

function App() {
  const { playerId } = usePlayerLobbyStore();
  const [playerInActiveGame, setPlayerInActiveGame] = useState<boolean>(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null; // Declare unsubscribe as callable or null

    const checkPlayerInActiveGame = async () => {
      try {
        const records = await pb.collection("game_players").getFullList({
          filter: `player_id = "${playerId}"`, // Filter to find the record
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
            console.log(e.action, e.record);
            if (e.record.player_id === playerId) {
              // Update state based on the action
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

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [playerId]);

  return (
    <div className="">
      <div className="container mx-auto flex flex-row">
        <div className="grow">
          <LoggedInUser />
          <CreatePlayer />
          <p>
            {playerInActiveGame
              ? "Player is in an active game"
              : "Player is not in an active game"}
          </p>
        </div>
        <div className="grow">
          <LobbyList />
          <PlayerLobbyFetcher />
        </div>
      </div>
    </div>
  );
}

export default App;
