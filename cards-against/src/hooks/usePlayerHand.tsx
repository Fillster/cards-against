import { useQuery } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";

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

const fetchPlayerHand = async (gamePlayerId: string | undefined) => {
  if (!gamePlayerId) throw new Error("No gamePlayerId provided");

  const resultList = await pb.collection("player_cards").getList(1, 50, {
    filter: `playerId="${gamePlayerId}"`,
    expand: "card_id",
  });

  return resultList.items;
};

export const usePlayerHand = (gamePlayerId: string | undefined) => {
  return useQuery({
    queryKey: ["playerHand", gamePlayerId], // Auto-refreshes when gamePlayerId changes
    queryFn: () => fetchPlayerHand(gamePlayerId),
    enabled: !!gamePlayerId, // Only fetch when gamePlayerId is available
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
