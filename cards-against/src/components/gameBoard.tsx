import React, { useEffect, useState } from "react";
import PlayersInGame from "./playersInGame";
import PlayerHand from "./playerHand";
import pb from "@/lib/pocketbase";
import { getCurrentRoundByGameId } from "@/api/api";
import usePlayerLobbyStore from "@/store/playerLobbyStore";

interface Card {
  id: string;
  text: string;
  type: string;
}

const GameBoard = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const { playerGameId } = usePlayerLobbyStore();
  //GET CURRENT ROUND. where playerGameId = game_ID. and Round= ACTIVE
  //PASS WHO card zard is to tomethign.
  //let other player select card. Then when they click done round IT get sent
  //to submissions.
  //WHEN ALL cards added to submissions reveal.
  //Card tzar pick one card. Find playerID from that card then give them +1 score
  //change roudn status to done. The give player new card and create new round.
  useEffect(() => {
    const fetchCurrentRound = async () => {
      try {
        const currentRound = await getCurrentRoundByGameId(playerGameId);
        console.log("Current round: ", currentRound?.czar_id);
        //set current tzar to zustand store. lobbylist can access this.
      } catch (error) {
        console.error("Error fetching current round: ", error);
      }
    };

    fetchCurrentRound();
  }, []);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Fetch the paginated records
        const resultList = await pb.collection("cards").getList(1, 4, {
          filter: 'type != "black"', // Adjust filter syntax for correct query
        });
        console.log(resultList.items);
        // Update state with the fetched records
        setCards(resultList.items); // Use `.items` from the result
      } catch (error) {
        console.error("Failed to fetch cards:", error); // Improved error logging
      }
    };

    fetchCards();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-[3] flex justify-center">
        <div className="container flex items-center border align-center">
          <div className="flex flex-col gap-2">
            <div className="">
              <div className="w-[200px] p-4 bg-black text-white h-[240px] border-2 border-slate-900 rounded hover:scale-110">
                The boy who sucks the farts out of my sweatpants.
                {cards.map((card) => (
                  <div key={card.id}>
                    <h3>{card.text}</h3>
                    <p>Type: {card.type}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-row gap-2 ">
              <div className="w-[200px] h-[240px] p-4 border-2 border-slate-900 rounded hover:scale-110">
                The boy who sucks the farts out of my sweatpants.
              </div>
              <div className="w-[200px] p-4 h-[240px] border-2 border-slate-900 rounded hover:scale-110">
                The boy who sucks the farts out of my sweatpants.
              </div>
              <div className="w-[200px] p-4 h-[240px] border-2 border-slate-900 rounded hover:scale-110">
                The boy who sucks the farts out of my sweatpants.
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-[1] flex flex-row gap-4">
        <PlayersInGame />
        <PlayerHand />
      </div>
    </div>
  );
};

export default GameBoard;
