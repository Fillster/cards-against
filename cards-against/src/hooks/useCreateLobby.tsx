import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createLobby } from "@/api/api";

export function useCreateLobby() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      hostLobbyName,
      playerId,
    }: {
      hostLobbyName: string;
      playerId: string;
    }) => createLobby(hostLobbyName, playerId),

    onSuccess: (newLobby) => {
      queryClient.invalidateQueries({ queryKey: ["lobbies"] });
      console.log("Lobby created successfully:", newLobby);
    },

    onError: (error) => {
      console.error("Failed to create lobby:", error);
    },
  });

  return mutation;
}
