import React, { useEffect, useState, useRef } from "react";
import pb from "@/lib/pocketbase";
import { Button } from "./ui/button";
import usePlayerLobbyStore from "@/store/playerLobbyStore";

interface LobbyPlayer {
  id: string;
  lobby_id: string;
  player_id: string; // Relation field pointing to players collection
  expand?: {
    player_id?: {
      name: string; // Name field from the players collection
    };
  };
}

const PlayerLobbyFetcher: React.FC = () => {
  const { playerLobbyId, setPlayerLobbyId, playerId } = usePlayerLobbyStore();
  const [lobbyPlayers, setLobbyPlayers] = useState<LobbyPlayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const hasFetched = useRef(false); // Tracks if fetch has already occurred

  useEffect(() => {
    console.log("PANG");
    // if (hasFetched.current) return; // Prevent duplicate fetch
    // hasFetched.current = true;

    const fetchPlayerLobby = async () => {
      //  const storedLobby = localStorage.getItem('playerLobby');
      console.log("DANG");
      if (playerLobbyId) {
        //setPlayerLobbyId(storedLobby);
        try {
          const players = await pb
            .collection("lobby_players")
            .getFullList<LobbyPlayer>({
              filter: `lobby_id="${playerLobbyId}"`,
              expand: "player_id", // Include related player data
            });
          setLobbyPlayers(players);
          console.log(players);
        } catch (err: any) {
          console.error("Error fetching lobby players:", err);
          setError(err.message || "Failed to fetch lobby players");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchPlayerLobby();
  }, [playerLobbyId]);

  // Function to handle leaving the lobby
  const leaveLobby = async () => {
    if (!playerId || !playerLobbyId) {
      console.error("Player is not in a lobby.");
      return;
    }

    try {
      // Find the player record in the lobby_players collection
      console.log("playerLobbyID: ,", playerLobbyId);
      console.log("playerID: ", playerId);
      const records = await pb
        .collection("lobby_players")
        .getFullList<LobbyPlayer>({
          filter: `player_id="${playerId}" && lobby_id="${playerLobbyId}"`,
        });

      if (records.length === 0) {
        console.error("Player is not in this lobby.");
        return;
      }

      // Delete the player record from the lobby_players collection
      await pb.collection("lobby_players").delete(records[0].id);

      // Clear the player's lobby info in localStorage and the Zustand store
      localStorage.removeItem("playerLobby");
      setPlayerLobbyId(null);
      setLobbyPlayers([]);

      console.log("Player successfully removed from lobby.");
    } catch (err: any) {
      console.error("Error removing player from lobby:", err);
      setError(err.message || "Failed to remove player from lobby");
    }
  };

  const fetchLobbyPlayers = async (lobbyId: string): Promise<LobbyPlayer[]> => {
    try {
      const records = await pb
        .collection("lobby_players")
        .getFullList<LobbyPlayer>({
          filter: `lobby_id="${lobbyId}"`,
        });
      console.log("Fetched lobby players:", records);
      return records;
    } catch (err: any) {
      console.error("Failed to fetch lobby players:", err);
      throw new Error(err.message || "Failed to fetch lobby players");
    }
  };

  const createGame = async (lobbyId: string): Promise<string> => {
    try {
      const data = {
        name: "test", // Example name, replace as needed
        host_id: playerId, // Replace with actual host ID
        status: "test", // Example status, replace as needed
        lobby_id: lobbyId,
      };
      const record = await pb.collection("games").create(data);
      console.log("Game created:", record);
      return record.id; // Assuming the created record has an `id` field
    } catch (err: any) {
      console.error("Failed to create game:", err);
      throw new Error(err.message || "Failed to create game");
    }
  };

  const addPlayersToGame = async (gameId: string, playerIds: string[]) => {
    for (const playerId of playerIds) {
      const data = {
        game_id: gameId,
        score: 0, // Example score, replace with actual logic if needed
        player_id: playerId,
      };
      try {
        const record = await pb.collection("game_players").create(data);
        console.log("Player added to game:", record);
      } catch (err: any) {
        console.error(`Failed to add player ${playerId} to game:`, err);
      }
    }
  };

  const StartGame = async () => {
    try {
      const lobbyPlayers = await fetchLobbyPlayers(playerLobbyId);
      const playerIds = lobbyPlayers.map((player) => player.player_id);

      const gameId = await createGame(playerLobbyId);
      await addPlayersToGame(gameId, playerIds);

      console.log("Game started successfully");
    } catch (err: any) {
      console.error("Failed to start game:", err);
      setError(err.message || "Failed to start game");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!playerLobbyId) {
    return <div>No player lobby found in localStorage.</div>;
  }

  return (
    <div className="border border-slate-500 mt-2 flex flex-col">
      <div className="p-2">
        <h1 className="font-bold">Lobby: {playerLobbyId}</h1>
        Player name:
      </div>
      {lobbyPlayers.length > 0 ? (
        <ul className="">
          {lobbyPlayers.map((player) => (
            <li className="border-b p-2" key={player.id}>
              {player.expand?.player_id?.name || "Unknown Player"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No players found for this lobby.</p>
      )}
      <div className="">
        <Button onClick={StartGame}>Start game</Button>
      </div>
      <div className="self-end">
        <Button onClick={leaveLobby}>Leave Lobby</Button>
      </div>
    </div>
  );
};

export default PlayerLobbyFetcher;
