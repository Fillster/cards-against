import "./App.css";

import LobbyList from "./components/lobbyList";
import CreatePlayer from "./components/createPlayer";
import LoggedInUser from "./components/loggedInUser";
import PlayerLobbyFetcher from "./components/playerLobbyFetcher";
function App() {
  return (
    <div className="container mx-auto flex flex-row">
      <div className="grow">
        <LoggedInUser />
        <CreatePlayer />
      </div>
      <div className="grow">
        <LobbyList />
        <PlayerLobbyFetcher />
        
      </div>
    </div>
  );
}

export default App;
