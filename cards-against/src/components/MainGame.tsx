import LobbyList from "./lobbyList";
import GameList from "./GameList";
import CreatePlayer from "./createPlayer";
import LoggedInUser from "./loggedInUser";
import PlayerLobbyFetcher from "./playerLobbyFetcher";
import GameBoard from "./gameBoard";
import CreateGame from "./createGame";
import { usePlayerInActiveGame } from "@/hooks/usePlayerInActiveGame";

const MainGame = () => {
  //check if player exist.
  // also set game_players id
  //also draw 10 cards random. and give to user.
  const playerInActiveGame = usePlayerInActiveGame();

  return (
    <div className="container mx-auto flex flex-col">
      <div className="w-[640px] flex flex-col gap-4 self-center">
        <h1>Cards Against Humanity</h1>
        <LoggedInUser />
        <CreatePlayer />
        <GameList />
        <CreateGame />
      </div>
      {playerInActiveGame && <GameBoard />}
    </div>
  );
};

export default MainGame;
