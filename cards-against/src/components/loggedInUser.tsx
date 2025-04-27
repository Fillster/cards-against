import { useGameStore } from "@/store/useGameStore";

const LoggedInUser: React.FC = () => {
  const playerName = useGameStore((state) => state.playerName);

  return (
    <div>
      {playerName ? (
        <p>Welcome, <strong>{playerName}</strong>!</p>
      ) : (
        <p>No player name found. Please set a player name.</p>
      )}
    </div>
  );
};

export default LoggedInUser;
