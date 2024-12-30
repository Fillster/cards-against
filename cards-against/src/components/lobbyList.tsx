import { useState, useEffect } from "react";
import pb from "@/lib/pocketbase";
import { Button } from "./ui/button";

// Define the structure of a lobby record
interface Lobby {
  id: string;
  name: string;
  [key: string]: any; // Add this if there are additional dynamic fields
}

const LobbyList: React.FC = () => {
  const [lobbies, setLobbies] = useState<Lobby[]>([]); // State to hold the list of lobbies
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const setupSubscription = async () => {
      try {
        // Fetch initial list of lobbies
        const records = await pb.collection('lobbies').getFullList<Lobby>();
        setLobbies(records);

        // Subscribe to changes in the 'lobbies' collection
        unsubscribe = await pb.collection('lobbies').subscribe('*', (e) => {
          console.log(e.action);
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

   useEffect(() => {
      // Retrieve the player name from localStorage when the component mounts
      const storedPlayerId = localStorage.getItem("playerId");
      setPlayerId(storedPlayerId);
    }, []); // Empty dependency array ensures this runs only once

  //when lobby click. take current username. get lobby id of clicked element.
  const handleLobbyJoin = async (lobbyId: string) => {
    console.log("Joining lobby:", lobbyId);
  
    // Retrieve playerId from localStorage or another source
    const playerId = localStorage.getItem("playerId"); // Assuming playerId is stored here
    if (!playerId) {
      console.error("No player ID found. Please log in or set a player name first.");
      return;
    }
  
    // Create the data object for the lobby_players collection
    const data = {
      lobby_id: lobbyId,
      user_id: playerId,
      is_ready: false,
    };
  
    try {
      // Create the record in the PocketBase 'lobby_players' collection
      const record = await pb.collection("lobby_players").create(data);
      console.log("Successfully joined lobby:", record);
    } catch (error: any) {
      console.error("Error joining lobby:", error.message);
    }
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
            <p>Players: 0/{lobby.max_players}</p>
            <Button onClick={() => handleLobbyJoin(lobby.id)}>Join</Button>
          </div>
        ))
      ) : (
        <div>No lobbies available</div>
      )}
    </div>
  );
};

export default LobbyList;
