import React, { useEffect, useState, useRef } from 'react';
import pb from '@/lib/pocketbase';
import { Button } from './ui/button';
import usePlayerLobbyStore from '@/store/playerLobbyStore';

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
        console.log("PANG")
       // if (hasFetched.current) return; // Prevent duplicate fetch
       // hasFetched.current = true;

        const fetchPlayerLobby = async () => {
          //  const storedLobby = localStorage.getItem('playerLobby');
            console.log("DANG");
            if (playerLobbyId) {
                //setPlayerLobbyId(storedLobby);
                try {
                    const players = await pb.collection('lobby_players').getFullList<LobbyPlayer>({
                        filter: `lobby_id="${playerLobbyId}"`,
                        expand: 'player_id', // Include related player data
                    });
                    setLobbyPlayers(players);
                    console.log(players);
                } catch (err: any) {
                    console.error('Error fetching lobby players:', err);
                    setError(err.message || 'Failed to fetch lobby players');
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
            console.log("playerLobbyID: ,", playerLobbyId)
            console.log("playerID: ", playerId)
            const records = await pb.collection('lobby_players').getFullList<LobbyPlayer>({
                filter: `player_id="${playerId}" && lobby_id="${playerLobbyId}"`,
            });

            if (records.length === 0) {
                console.error("Player is not in this lobby.");
                return;
            }

            // Delete the player record from the lobby_players collection
            await pb.collection('lobby_players').delete(records[0].id);

            // Clear the player's lobby info in localStorage and the Zustand store
            localStorage.removeItem('playerLobby');
            setPlayerLobbyId(null);
            setLobbyPlayers([])

            console.log("Player successfully removed from lobby.");
        } catch (err: any) {
            console.error("Error removing player from lobby:", err);
            setError(err.message || 'Failed to remove player from lobby');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

   

    if (!playerLobbyId) {
        return <div>No player lobby found in localStorage.</div>;
    }

    return (
        <div>
            <h1>Players in Lobby {playerLobbyId}</h1>
            {lobbyPlayers.length > 0 ? (
                <ul>
                    {lobbyPlayers.map((player) => (
                        <li key={player.id}>
                            {player.expand?.player_id?.name || 'Unknown Player'}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No players found for this lobby.</p>
            )}
            <Button onClick={leaveLobby}>
                Leave Lobby
            </Button>
        </div>
    );
};

export default PlayerLobbyFetcher;
