import React, { useCallback, useEffect, useState } from "react";
import pb from "@/lib/pocketbase";
import { getSubmissions } from "@/api/api";
import { useGameStore } from "@/store/useGameStore";
import PlayerCard from "./playerCard";
import { useRealtimeSubmissions } from "@/hooks/useRealtimeSubmissions";
import { useNextRound } from "@/hooks/useNextRound";
interface Submission {
  id: string;
  round_id: string;
  card_id: string;
  game_players_id: string;
  expand?: {
    card_id?: {
      text: string;
    };
  };
}

const PlayerSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
  const { nextRound } = useNextRound();
  const { playerState, currentRound, isCardCzar } = useGameStore();
  const currentPlayerId = pb.authStore.model?.id;

  useEffect(() => {
    const fetchCurrentSubmissions = async () => {
      try {
        const result = await getSubmissions(currentRound);
        if (result?.items) {
          const formatted = result.items.map((item: any) => ({
            id: item.id,
            round_id: item.round_id,
            card_id: item.card_id,
            game_players_id: item.game_players_id,
            expand: item.expand || {},
          }));
          setSubmissions(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch submissions:", error);
      }
    };

    fetchCurrentSubmissions();
  }, [currentRound]);

  const handleRealtimeUpdate = useCallback(async (e: { action: string; record: Submission }) => {
    if (e.action === "create") {
      try {
        const fullSubmission = await pb.collection("submissions").getOne(e.record.id, {
          expand: "card_id",
        });
  
        setSubmissions((prev) => [...prev, fullSubmission]);
      } catch (err) {
        console.error("Error fetching expanded submission:", err);
      }
    } else if (e.action === "update") {
      setSubmissions((prev) =>
        prev.map((sub) => (sub.id === e.record.id ? e.record : sub))
      );
    } else if (e.action === "delete") {
      setSubmissions((prev) => prev.filter((sub) => sub.id !== e.record.id));
    }
  
    setCurrentSubmission(e.record);
  }, []);
  

  useRealtimeSubmissions<Submission>(handleRealtimeUpdate);

  const getCardText = (submission: Submission) => {
    const isVisibleToPlayer =
      playerState === "viewing_results" ||
      isCardCzar ||
      submission.game_players_id === currentPlayerId;

    return isVisibleToPlayer ? submission.expand?.card_id?.text || "" : "";
  };

 
const handleCardClick = async (submission: Submission) => {
  if (!isCardCzar) return;

  setSelectedSubmissionId(submission.id);
  console.log("Card Czar selected submission:", submission);

  const playerId = submission.game_players_id;

  try {
    const player = await pb.collection("game_players").getOne(playerId);
    await pb.collection("game_players").update(playerId, {
      points: (player.points || 0) + 100,
    });

    console.log(`Awarded 100 points to player ${playerId}`);

    // 🔥 Start next round after scoring
    await nextRound(currentRound.game_id, currentRound.czar_id);
  } catch (err) {
    console.error("Error handling card click:", err);
  }
};
  

  if (!submissions.length && playerState !== "waiting") {
    return <div>Loading submissions...</div>;
  }

  return (
    <div className="flex flex-row gap-2">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          onClick={() => handleCardClick(submission)}
          className={`cursor-pointer ${
            isCardCzar ? "hover:scale-105 transition-transform" : ""
          } ${selectedSubmissionId === submission.id ? "ring-2 ring-blue-500" : ""}`}
        >
          <PlayerCard
            text={getCardText(submission)}
            type="white"
          />
        </div>
      ))}
    </div>
  );
};

export default PlayerSubmissions;
