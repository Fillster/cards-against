// hooks/useActiveRound.ts
import { useEffect, useState } from "react";
import pb from "@/lib/pocketbase";
import { useGameStore

 } from "@/store/useGameStore";
export const useActiveRound = (gameId: string, playerId: string) => {
  const [blackCardText, setBlackCardText] = useState<string | null>(null);
  const [roundId, setRoundId] = useState<string | null>(null);
  const [isCardCzar, setIsCardCzar] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const clearPlayerSubmitList = useGameStore((state) => state.clearPlayerSubmitList);
  const setCurrentCardCzarId = useGameStore((state) => state.setCurrentCardCzarId);
  useEffect(() => {
    if (!gameId) return;

    let unsubscribe: (() => void) | null = null;

    const fetchActiveRound = async () => {
      try {
        const activeRound = await pb.collection("rounds").getFirstListItem(
          `game_id="${gameId}" && status="Active"`,
          {
            expand: "black_card_id", // important: fetch full black card details
          }
        );

        if (activeRound) {
          setRoundId(activeRound.id);
          setBlackCardText(activeRound.expand?.black_card_id?.text ?? ""); 
          setIsCardCzar(activeRound.czar_id === playerId);
          clearPlayerSubmitList(); 
          setCurrentCardCzarId(activeRound.czar_id);
        } else {
          setRoundId(null);
          setBlackCardText(null);
          setIsCardCzar(false);
        }
      } catch (err) {
        console.error("Error fetching active round:", err);
      } finally {
        setLoading(false);
      }
    };

    const subscribeToRounds = async () => {
      unsubscribe = await pb.collection("rounds").subscribe("*", async (e) => {
        const record = e.record;
    
        // Only react if it's for the current game
        if (record.game_id === gameId) {
          if ((e.action === "create" || e.action === "update") && record.status === "Active") {
            try {
              const fullRound = await pb.collection("rounds").getOne(record.id, {
                expand: "black_card_id",
              });
    
              setRoundId(fullRound.id);
              setBlackCardText(fullRound.expand?.black_card_id?.text ?? "");
              setIsCardCzar(fullRound.czar_id === playerId);
              setCurrentCardCzarId(fullRound.czar_id);
              clearPlayerSubmitList();
            } catch (error) {
              console.error("Error fetching updated round:", error);
            }
          } else if (e.action === "delete" && record.id === roundId) {
            setRoundId(null);
            setBlackCardText(null);
            setIsCardCzar(false);
          }
        }
      });
    };
    

    fetchActiveRound();
    subscribeToRounds();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [gameId, playerId]);

  return { blackCardText, roundId, isCardCzar, loading };
};
