import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbase';

interface PlayerLobbyCountProps {
  lobbyId: string;
}

const PlayerLobbyCount: React.FC<PlayerLobbyCountProps> = ({ lobbyId }) => {
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayerCount = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all players in the given lobby
        const players = await pb.collection('lobby_players').getFullList({
          filter: `lobby_id="${lobbyId}"`,
        });
        // Set the number of players in the lobby
        setPlayerCount(players.length);
      } catch (err: any) {
        console.error('Error fetching player count:', err);
        setError(err.message || 'Failed to fetch player count');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerCount();
  }, [lobbyId]);

  if (loading) {
    return <span>Loading...</span>;
  }



  return (
    <span>
      {playerCount !== null ? playerCount : 0} players
    </span>
  );
};

export default PlayerLobbyCount;
