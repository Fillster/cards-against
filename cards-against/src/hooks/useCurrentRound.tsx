import { useQuery } from "@tanstack/react-query";
import pb from "@/lib/pocketbase";

interface Round {
  id: string;
  czar_id: string; // who is the czar for this round
  black_card_id: string;
  expand?: {
    black_card_id?: {
      text: string;
    };
  };
}

const fetchCurrentRound = async (gameId: string | null) => {
  if (!gameId) throw new Error("No gameId provided");

  const round = await pb.collection("rounds").getFirstListItem<Round>(`game_id="${gameId}"`, {
    expand: "black_card_id",
  });
  return round;
};

export const useCurrentRound = (gameId: string | null) => {
  return useQuery({
    queryKey: ["currentRound", gameId],
    queryFn: () => fetchCurrentRound(gameId),
    enabled: !!gameId, // only run if we have a gameId
    staleTime: 1000 * 30, // 30 seconds
  });
};
