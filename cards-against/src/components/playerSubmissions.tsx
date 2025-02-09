import React, { useEffect, useState } from "react";
import pb from "@/lib/pocketbase";
import { getSubmissions } from "@/api/api";
import { useGameStore } from "@/store/useGameStore";
import PlayerCard from "./playerCard";
//Subscribe to change in submissions.
//view submissions where round_id === currentround.
//being able to toggle visibility of cards
//when playface only show cardw where playerid == submissionid
// vote face. Reveal all.

// player state. selectCardState, waitState, juryWaitState, jurySelectCardState
//this can be handle on client.

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
  const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(
    null
  );
  const { playerState } = useGameStore();

  useEffect(() => {
    // Fetch current submissions
    const fetchCurrentSubmissions = async () => {
      try {
        const submissionResult = await getSubmissions("999ufr59e9v00rg");
        if (submissionResult?.items) {
          console.log(submissionResult);
          const formattedSubmissions: Submission[] = submissionResult.items.map(
            (item) => ({
              id: item.id,
              round_id: item.round_id, // Ensure this field exists in `item`
              card_id: item.card_id, // Ensure this field exists in `item`
              game_players_id: item.game_players_id, // Ensure this field exists in `item`
              expand: item.expand || {}, // Ensure expand is preserved
            })
          );

          setSubmissions(formattedSubmissions);
        }
      } catch (error) {
        console.log(error);
      }
    };
    //setSubmissions(submissionResult);
    fetchCurrentSubmissions();

    // Function to handle real-time updates
    const handleRealtimeUpdate = (e: {
      action: string;
      record: Submission;
    }) => {
      console.log(e.action, e.record);
      setSubmissions((prev) => {
        if (e.action === "create") {
          return [...prev, e.record];
        } else if (e.action === "update") {
          return prev.map((sub) => (sub.id === e.record.id ? e.record : sub));
        } else if (e.action === "delete") {
          return prev.filter((sub) => sub.id !== e.record.id);
        }
        return prev;
      });
      setCurrentSubmission(e.record); // Update current submission
    };

    // Subscribe to PocketBase real-time updates
    pb.collection("submissions").subscribe("*", handleRealtimeUpdate);

    // Cleanup function
    return () => {
      pb.collection("submissions").unsubscribe("*");
    };
  }, []);

  if (playerState == "viewing_results") {
    return (
      <div className="flex flex-row gap-2 ">
        {submissions.map((submission) => (
          <PlayerCard
            key={submission.id}
            text={submission.expand?.card_id?.text || ""}
            type="white"
          />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-row gap-2 ">
      {submissions.map((submission) => (
        <PlayerCard
          key={submission.id}
          text={submission.expand?.card_id?.text || ""}
          type="white"
        />
      ))}
    </div>
  );
};

export default PlayerSubmissions;
