import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinLobby } from "@/api/api";
import usePlayerLobbyStore from "@/store/playerLobbyStore";

export function useJoinLobby() {
  const queryClient = useQueryClient();
  const setPlayerLobbyId = usePlayerLobbyStore(
    (state) => state.setPlayerLobbyId
  );

  return useMutation({
    mutationFn: async ({
      lobbyId,
      playerId,
    }: {
      lobbyId: string;
      playerId: string;
    }) => joinLobby(lobbyId, playerId),

    onSuccess: (newLobbyPlayer) => {
      console.log("Joined lobby successfully:", newLobbyPlayer);

      // ✅ Update Zustand state
      setPlayerLobbyId(newLobbyPlayer.lobby_id);

      // ✅ Invalidate and refetch lobbies to reflect new changes
      queryClient.invalidateQueries({ queryKey: ["lobbies"] });
    },

    onError: (error) => {
      console.error("Failed to join lobby:", error);
    },
  });
}
