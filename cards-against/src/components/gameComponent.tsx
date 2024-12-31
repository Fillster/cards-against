import React, { useEffect, useState } from "react";
import usePlayerLobbyStore from "../store/playerLobbyStore"; // Adjust the path as needed
import pb from "@/lib/pocketbase";

const GameComponent: React.FC = () => {
  const { playerLobbyId } = usePlayerLobbyStore(); // Access playerLobbyId from Zustand
  const [showGameBoard, setShowGameBoard] = useState(false);

  useEffect(() => {
    if (!playerLobbyId) {
      console.warn(
        "PlayerLobbyId is null. Cannot subscribe to games collection."
      );
      return;
    }

    // Subscribe to the 'games' collection
    let unsubscribe: (() => void) | null = null;
    unsubscribe = await pb.collection("games").subscribe("*", (e) => {
      if (e.action === "update" && e.record.host_id === playerLobbyId) {
        if (e.record.status === "in-progress") {
          setShowGameBoard(true); // Show the gameboard when status changes
        }
      }
    });

    // Cleanup subscription on component unmount
    return () => {
      // Call the unsubscribe function
      unsubscribe();
    };
  }, [playerLobbyId]);

  return (
    <div>
      {showGameBoard ? (
        <div>hej</div>
      ) : (
        //  <GameBoard /> // Replace with your gameboard component
        // <Lobby /> // Replace with your lobby component
        <div>da</div>
      )}
    </div>
  );
};

export default GameComponent;
