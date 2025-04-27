import { useGameStore } from "@/store/useGameStore";
import { usePlayerHand } from "@/hooks/usePlayerHand"; 
import { createSubmission } from "@/api/api";
import { useEffect } from "react";

interface SubmissionData {
  round_id: string;
  card_id: string;
  game_players_id: string;
}

const PlayerHand = () => {
  //const { playerGameId } = usePlayerLobbyStore();
  const gameId = useGameStore((state) => state.gameId)
  const gamePlayerId = useGameStore((state) => state.gamePlayerId);
  const currentRound = useGameStore((state) => state.currentRound);
  const playerState = useGameStore((state) => state.playerState);
  const setPlayerState = useGameStore((state) => state.setPlayerState);
  console.log("YOU PLAYERSTAE IS : ", playerState)
  const { data: playerHand = [], isLoading, error, refetch  } = usePlayerHand(gamePlayerId ?? undefined);
 
  useEffect(() => {
    if (playerHand.length === 0 && !isLoading && !error) {
      const timer = setTimeout(() => {
        console.log("Hand is empty, retrying fetch...");
        refetch();
      }, 1000); // wait 2 seconds before trying again
  
      return () => clearTimeout(timer);
    }
  }, [playerHand, isLoading, error, refetch]);

  if (!gamePlayerId) {
      return <p>Joining game... waiting for hand...</p>;
    }

  const handleCardSubmission = async (cardId: string | undefined) => {
    if (!cardId || !gameId || !currentRound) {
      console.error("Missing required submission info");
      return;
    }
   
    if (playerState !== "choosing_card") {
      console.warn("You cannot submit a card right now.");
      return;
    }
   
    const input: SubmissionData = {
      round_id: currentRound,
      card_id: cardId,
      game_players_id: gamePlayerId,
    };
    console.log(input)
    try {
      const result = await createSubmission(input);
      console.log("Card submitted:", result);
      setPlayerState("waiting"); // ✅ Set player to waiting
    } catch (e) {
      console.error("Submission failed:", e);
    }
  };

  if (isLoading) return <p>Loading cards...</p>;
  if (error) return <p>Error loading cards: {error.message}</p>;

  return (
    <div className="flex flex-row gap-2">
      {playerHand.length === 0 && <p>No cards in hand</p>}
      {playerHand.map((card) => (
        <div
          key={card.id}
          className={`w-[200px] p-4 h-[240px] border-2 border-slate-900 rounded ${
            playerState === "choosing_card" ? "hover:scale-110 cursor-pointer" : "opacity-50 cursor-not-allowed"
          }`}
          onClick={() => {
            if (playerState === "choosing_card") {
              handleCardSubmission(card.expand?.card_id?.id);
            }
          }}
        >
          {card.expand?.card_id?.text}
        </div>
      ))}
    </div>
  );
};

export default PlayerHand;
