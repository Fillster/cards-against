import usePlayerLobbyStore from "@/store/playerLobbyStore";
import { useGameStore } from "@/store/useGameStore";
import { useEffect, useState } from "react";
import pb from "@/lib/pocketbase";
import { createSubmission } from "@/api/api";

interface PlayerHand {
  id: string;
  is_played: boolean;
  expand?: {
    card_id?: {
      text: string;
      type: string;
      id: string;
    };
  };
}

interface SubmissionData {
  round_id: string;
  card_id: string;
  game_players_id: string;
}

const PlayerHand = () => {
  const { playerId } = usePlayerLobbyStore();
  const { playerGameId } = usePlayerLobbyStore();
  const [playerHand, setPlayerHand] = useState<PlayerHand[]>([]);
  const { gamePlayerId } = useGameStore(); // ✅ Added setGamePlayerId
  
  useEffect(() => {
    const fetchPlayerHandsCard = async () => {
      try {
        console.log(gamePlayerId)
        console.log("PLAYER HAND: ", "8694kmtc458075l")
        const resultList = await pb.collection("player_cards").getList(1, 50, {
          filter: `playerId="${gamePlayerId}"`,
          expand: "card_id", // Include related player data
        });
        console.log("player hand: ", resultList);
        setPlayerHand(resultList.items);
        return resultList;
      } catch (e) {
        console.log(e);
      }
    };

    fetchPlayerHandsCard();
  }, []);

  //CHECK T HAT GAME PLAYERS IS CORRECT::::::::::::
  const handleOnCardClick = async (cardId: string | undefined) => {
    if (!cardId || !playerGameId) {
      console.error("Missing cardId or playerId");
      return;
    }
    const input: SubmissionData = {
      round_id: "999ufr59e9v00rg",
      card_id: cardId,
      game_players_id: playerGameId,
    };
    console.log("INPUT: ", input);
    try {
      const result = await createSubmission(input);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex flex-row gap-2">
      {playerHand.length === 0 && <p>No cards in hand</p>}
      {playerHand.map((cards) => (
        <div
          className="w-[200px] p-4 h-[240px] border-2 border-slate-900 rounded hover:scale-110"
          onClick={() => handleOnCardClick(cards.expand?.card_id?.id)}
        >
          {cards.expand?.card_id?.text}
        </div>
      ))}
    </div>
  );
};

export default PlayerHand;
