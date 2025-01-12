import usePlayerLobbyStore from "@/store/playerLobbyStore";
import { useEffect, useState } from "react";
import pb from "@/lib/pocketbase";

interface PlayerHand {
  id: string;
  is_played: boolean;
  expand?: {
    card_id?: {
      text: string;
      type: string;
    };
  };
}

const PlayerHand = () => {
  const { playerId } = usePlayerLobbyStore();
  const [playerHand, setPlayerHand] = useState<PlayerHand[]>([]);

  useEffect(() => {
    const fetchPlayerHandsCard = async () => {
      try {
        const resultList = await pb.collection("player_cards").getList(1, 50, {
          filter: `player_id="${playerId}"`,
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

  return (
    <div className="flex flex-row gap-2">
      {playerHand.length === 0 && <p>No cards in hand</p>}
      {playerHand.map((cards) => (
        <div className="w-[200px] p-4 h-[240px] border-2 border-slate-900 rounded hover:scale-110">
          {cards.expand?.card_id?.text}
        </div>
      ))}
      <div className="w-[200px] p-4 h-[240px] border-2 border-slate-900 rounded hover:scale-110">
        The boy who sucks the farts out of my sweatpants.
      </div>
      <div className="w-[200px] p-4 h-[240px] border-2 border-slate-900 rounded hover:scale-110">
        The boy who sucks the farts out of my sweatpants.
      </div>
      <div className="w-[200px] p-4 h-[240px] border-2 border-slate-900 rounded hover:scale-110">
        The boy who sucks the farts out of my sweatpants.
      </div>
    </div>
  );
};

export default PlayerHand;
