import usePlayerLobbyStore from "@/store/playerLobbyStore";
import { useGameStore } from "@/store/useGameStore";
import { usePlayerHand } from "@/hooks/usePlayerHand"; 
import { createSubmission } from "@/api/api";

interface SubmissionData {
  round_id: string;
  card_id: string;
  game_players_id: string;
}

const PlayerHand = () => {
  const { playerGameId } = usePlayerLobbyStore();
  const { gamePlayerId } = useGameStore();

  const { data: playerHand = [], isLoading, error } = usePlayerHand(gamePlayerId ?? undefined);

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

    try {
      const result = await createSubmission(input);
      console.log(result);
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading) return <p>Loading cards...</p>;
  if (error) return <p>Error loading cards: {error.message}</p>;

  return (
    <div className="flex flex-row gap-2">
      {playerHand.length === 0 && <p>No cards in hand</p>}
      {playerHand.map((cards) => (
        <div
          key={cards.id} // ✅ Added key for better rendering
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
