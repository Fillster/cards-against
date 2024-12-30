// components/LobbyList.tsx
import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';
import { Button } from './ui/button';
import usePlayerLobbyStore from '@/store/playerLobbyStore';
import PlayerLobbyCount from './playerLobbyCount';
// Define the structure of a lobby record
interface Lobby {
  id: string;
  name: string;
  current_player: number;
  [key: string]: any; // Add this if there are additional dynamic fields
}

const LobbyList: React.FC = () => {
  const [lobbies, setLobbies] = useState<Lobby[]>([]); // State to hold the list of lobbies
  const { playerId, setPlayerLobbyId } = usePlayerLobbyStore(); // Access playerId and store update functions
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setupSubscription = async () => {
      try {
        // Fetch initial list of lobbies
        const records = await pb.collection('lobbies').getFullList<Lobby>();
        setLobbies(records);

        // Subscribe to changes in the 'lobbies' collection
        unsubscribe = await pb.collection('lobbies').subscribe('*', (e) => {
          console.log("this: ", e.action);
          console.log(e.record);

          setLobbies((prevLobbies) => {
            switch (e.action) {
              case 'create': // Add new lobby
                return [...prevLobbies, e.record];
              case 'update': // Update existing lobby
                return prevLobbies.map((lobby) =>
                  lobby.id === e.record.id ? e.record : lobby
                );
              case 'delete': // Remove deleted lobby
                return prevLobbies.filter((lobby) => lobby.id !== e.record.id);
              default:
                return prevLobbies;
            }
          });
        });
      } catch (error) {
        console.error("Error setting up subscription or fetching data:", error);
      }
    };

    setupSubscription();

    // Cleanup subscription on component unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleLobbyJoin = async (lobbyId: string) => {
    if (!playerId) {
      console.error("No player ID found. Please log in or set a player name first.");
      return;
    }

    const data = {
      lobby_id: lobbyId,
      player_id: playerId,
      is_ready: false,
    };

    try {
      const record = await pb.collection("lobby_players").create(data);
      console.log("Successfully joined lobby:", record);

      // Update player lobby state in Zustand and localStorage
      setPlayerLobbyId(lobbyId);
    } catch (error: any) {
      console.error("Error joining lobby:", error.message);
    }
  };

  const onCreateLobby = async () => {
    if (!playerId) {
      console.error("Player ID is required to create a lobby.");
      return;
    }

    const data = {
      max_players: 8,
      name: "test",
      is_active: true,
      host_id: playerId,
    };

    const record = await pb.collection('lobbies').create(data);
    console.log("Created new lobby:", record);
  };

  return (
    <div className="flex flex-col">
      <div>
        <h1 className="text-xl">Lobby List:</h1>
      </div>
      {lobbies.length > 0 ? (
        lobbies.map((lobby) => (
          <div key={lobby.id} className="p-2 border-b flex flex-row gap-2">
            <p>{lobby.name || `Lobby ${lobby.id}`}</p>
            <p>Players: <PlayerLobbyCount lobbyId={lobby.id} />/{lobby.max_players}</p>
            <Button onClick={() => handleLobbyJoin(lobby.id)}>Join</Button>
          </div>
        ))
      ) : (
        <div>No lobbies available</div>
      )}
      <Button onClick={onCreateLobby}>Create Lobby</Button>
    </div>
  );
};

export default LobbyList;
