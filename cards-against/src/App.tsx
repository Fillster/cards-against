import "./App.css";

import LobbyList from "./components/lobbyList";
import CreatePlayer from "./components/createPlayer";
import LoggedInUser from "./components/loggedInUser";
import PlayerLobbyFetcher from "./components/playerLobbyFetcher";
import { usePlayerInActiveGame } from "./hooks/usePlayerInActiveGame";
import GameBoard from "./components/GameBoard";

function App() {
  const playerInActiveGame = usePlayerInActiveGame();

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
      <GameBoard />
    </div>
  );
}

export default App;
