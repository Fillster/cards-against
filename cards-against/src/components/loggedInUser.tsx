import React, { useEffect, useState } from "react";

const LoggedInUser: React.FC = () => {
  const [playerName, setPlayerName] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the player name from localStorage when the component mounts
    const storedPlayerName = localStorage.getItem("playerName");
    setPlayerName(storedPlayerName);
  }, []); // Empty dependency array ensures this runs only once

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
