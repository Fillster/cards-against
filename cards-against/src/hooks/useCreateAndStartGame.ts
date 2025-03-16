import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateGame } from "@/hooks/useCreateGame";
import { useJoinGame } from "@/hooks/useJoinGame";
import { useDrawBlackCard } from "@/hooks/useDrawBlackCard";
import { useCreateRound } from "./UseCreateRound";

interface StartGameParams {
  playerId: string;
  gameName: string;
}

export function useCreateAndStartGame() {
    const queryClient = useQueryClient();
  
    const createGame = useCreateGame();
    const joinGame = useJoinGame();
    const drawBlackCard = useDrawBlackCard();
    const createRound = useCreateRound();
  
    return useMutation({
      mutationFn: async ({ playerId, gameName }: StartGameParams) => {
        if (!playerId) throw new Error("Player ID is required.");
  
        // Step 1: Create Game
        const gameId = await createGame.mutateAsync({ playerId, name: gameName, status: "active" });
  
        // Step 2: Join Game
        await joinGame.mutateAsync({ gameId, playerId, score: 0 });
  
        // Step 3: Draw Black Card
        const blackCard = await drawBlackCard.mutateAsync();
  
        // Step 4: Create Round
        await createRound.mutateAsync({
          game_id: gameId,
          black_card_id: blackCard.id,
          status: "Active",
          czar_id: playerId,
        });
  
        // Optional: Invalidate Queries to Refetch Updated Data
        queryClient.invalidateQueries({queryKey: ["playerHand"]});
        queryClient.invalidateQueries({ queryKey: ["game", gameId] });
      },
      onError: (error) => console.error("❌ Error starting game:", error),
    });
  }
  