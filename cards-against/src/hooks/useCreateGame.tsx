import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createGame } from "@/api/api"; // Import the API function
import { CreateGameData } from "@/types"; // Ensure this type is correctly defined

export function useCreateGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gameData: CreateGameData) => createGame(gameData),

    onSuccess: (gameId) => {
      console.log("Game created successfully with ID:", gameId);

      // Optionally invalidate or refetch related queries
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },

    onError: (error) => {
      console.error("Failed to create game:", error);
    },
  });
}
