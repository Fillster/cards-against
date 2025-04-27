// hooks/useNextRound.ts
import { useCreateRound } from './useCreateRound';
import { useDrawBlackCard } from './useDrawBlackCard';
import pb from '@/lib/pocketbase';
import { useGameStore } from '@/store/useGameStore';

export const useNextRound = () => {
  const { mutate: createRound } = useCreateRound();
  const { mutateAsync: drawBlackCard } = useDrawBlackCard(); // ✅ this gives us the card
  const resetFrontendRound = useGameStore.getState().nextRound;


  const nextRound = async (currentGameId: string, currentCzarId: string) => {
    try {

      const currentRound = await pb.collection("rounds").getFirstListItem(
        `game_id="${currentGameId}" && status="Active"`
      );
  
     
      if (currentRound) {
        await pb.collection("rounds").update(currentRound.id, {
          status: "completed",
          endedAt: new Date().toISOString(), // optional: timestamp
        });
      }

      // 🔁 Draw a black card using the mutation
      const randomCard = await drawBlackCard();

      // 🔁 Get all players in the game
      const players = await pb.collection("game_players").getFullList({
        filter: `game_id="${currentGameId}"`,
      });

      if (players.length === 0) {
        console.warn("No players in game");
        return;
      }

      // 🔁 Rotate Czar
      console.log("current czar: ", currentCzarId)
      console.log("players: ", players)
      const currentIndex = players.findIndex((p) => p.player_id === currentCzarId);
      const nextCzar = players[(currentIndex + 1) % players.length];
      console.log("next czar: ", nextCzar)
      console.log("game_id: ", currentGameId)
      console.log("random black : ", randomCard)
     
      // ✅ Create new round
      createRound({
        game_id: currentGameId,
        black_card_id: randomCard.id,
        status: "Active",
        czar_id: nextCzar.player_id,
      });

    resetFrontendRound();
    } catch (err) {
      console.error("Failed to start next round:", err);
    }
  };

  return { nextRound };
};
