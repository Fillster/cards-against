// hooks/useNextRound.ts
import { useCreateRound } from './useCreateRound';
import { useDrawBlackCard } from './useDrawBlackCard';
import pb from '@/lib/pocketbase';

export const useNextRound = () => {
  const { mutate: createRound } = useCreateRound();
  const { mutateAsync: drawBlackCard } = useDrawBlackCard(); // ✅ this gives us the card

  const nextRound = async (currentGameId: string, currentCzarId: string) => {
    try {
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
      const currentIndex = players.findIndex((p) => p.id === currentCzarId);
      const nextCzar = players[(currentIndex + 1) % players.length];

      // ✅ Create new round
      createRound({
        game_id: currentGameId,
        black_card_id: randomCard.id,
        status: "playing",
        czar_id: nextCzar.id,
      });

    } catch (err) {
      console.error("Failed to start next round:", err);
    }
  };

  return { nextRound };
};
