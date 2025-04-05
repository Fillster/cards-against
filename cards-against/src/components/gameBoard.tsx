import React, { useEffect, useState } from "react";
import PlayersInGame from "./playersInGame";
import PlayerHand from "./playerHand";
import pb from "@/lib/pocketbase";
import { drawWhiteCards, getCurrentRoundByGameId } from "@/api/api";
import usePlayerLobbyStore from "@/store/playerLobbyStore";
import PlayerCard from "./playerCard";
import { useGameStore } from "@/store/useGameStore";
import PlayerSubmissions from "./playerSubmissions";
import LeaveGameButton from "./LeaveGameButton";
interface Card {
  id: string;
  text: string;
  type: string;
}

interface Rounds {
  id: string;
  black_card_id: string;
  status: string;
  czar_id: string;
  expand?: {
    black_card_id?: {
      text: string;
    };
  };
}

const GameBoard = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [blackCard, setBlackCard] = useState<String>("");

  const { playerGameId } = usePlayerLobbyStore();
  const { playerState } = useGameStore();
  const setCurrentRound = useGameStore((state) => state.setCurrentRound);

  //GET CURRENT ROUND. where playerGameId = game_ID. and Round= ACTIVE
  //PASS WHO card zard is to tomethign.
  //let other player select card. Then when they click done round IT get sent
  //to submissions.
  //WHEN ALL cards added to submissions reveal.
  //Card tzar pick one card. Find playerID from that card then give them +1 score
  //change roudn status to done. The give player new card and create new round.

 
  useEffect(() => {
    const fetchCurrentRound = async () => {
      if (!playerGameId) return;
      try {
        const roundData = await getCurrentRoundByGameId(playerGameId);
        if (roundData) {
          setCurrentRound(roundData.id);
        
          setBlackCard(roundData.expand.black_card_id.text);
          //setCzarId(roundData.czar_id); // Store czar ID in Zustand
          console.log(roundData);
        }
      } catch (error) {
        console.error("Error fetching current round:", error);
      }
    };

    fetchCurrentRound();
  }, [playerGameId]);


  return (
    <div className="h-screen flex flex-col">
      <h1>{playerGameId}</h1>
      <div className="flex-[3] flex justify-center">
        <div className="container flex items-center border align-center">
          <div className="flex flex-col gap-2">
            <div className="">
              <PlayerCard text={blackCard} type={"black"} />
            </div>
            <div className="flex flex-row gap-2 ">
              <PlayerSubmissions />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-[1] flex flex-row gap-4">
        <PlayersInGame />
        <PlayerHand />
        <LeaveGameButton />
      </div>
    </div>
  );
};

export default GameBoard;
