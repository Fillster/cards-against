import pb from "@/lib/pocketbase";
import fs from "fs";

interface Rounds {
    id: string;
    black_card_id: string;
    status: string;
    czar_id: string; // Add this if there are additional dynamic fields
    expand?: {
        black_card_id?: {
          text: string;
        }
      }
    }

interface SubmissionData {
    round_id: string;
    card_id: string;
    game_players_id: string;
    }


export async function getCurrentRoundByGameId(player_game_id: string | null) {
    if (!player_game_id) {
        // Handle the null or empty case
        console.warn('player_game_id is null or undefined. Exiting function.');
        return null; // or throw an error, depending on your use case
    }

    try {
        // Fetch the first record where game_id matches the given player_game_id
        const round = await pb.collection('rounds').getFirstListItem<Rounds>(`game_id="${player_game_id}"`, {
            expand: "black_card_id",
        });
        
        return round; // Return the fetched round
    } catch (error) {
        console.error('Error fetching current round:', error);
        throw error; // Optionally rethrow the error for further handling
    }
}


export async function createSubmission(data: SubmissionData) {
    try {
      const record = await pb.collection("submissions").create(data);
      return record; // Return the created submission record
    } catch (error) {
      console.error("Error creating submission:", error);
      throw error; // Rethrow the error for handling in the calling function
    }
  }

  export async function getSubmissions(roundId: string) {
    try {
      const resultList = await pb.collection('submissions').getList(1, 4, {
        filter: `round_id = "${roundId}"`,
        expand: "card_id",
    });
    return resultList;
    } catch (error) {
      console.error("Error creating submission:", error);
      throw error; // Rethrow the error for handling in the calling function
    }
  }


export async function drawUniqueCard(playerId: string, gameId: string) {
    // Fetch one card that is NOT already in player_cards for this game
    const availableCards = await pb.collection('cards').getList(1, 1, {
      filter: `id NOT IN (SELECT card_id FROM player_cards WHERE game_id = "${gameId}")`,
      sort: '@random' // Get a random card
    });
  
    if (availableCards.items.length === 0) {
      throw new Error("No more unique cards available.");
    }
  
    const drawnCard = availableCards.items[0];
  
    // Assign the card to the player
    await pb.collection('player_cards').create({
      player_id: playerId,
      game_id: gameId,
      card_id: drawnCard.id,
      used: false
    });
  
    return drawnCard;
  }
  

  export async function drawWhiteCards(playerId: string, gameId: string) {
    // Fetch 10 unique white cards that are not in player_cards
    const availableCards = await pb.collection('cards').getList(1, 10, {
      filter: `type = "white" && id NOT IN (SELECT card_id FROM player_cards WHERE game_id = "${gameId}" && player_id = "${playerId}")`,
      sort: '@random' // Random selection
    });
  
    if (availableCards.items.length === 0) {
      throw new Error("No more unique white cards available.");
    }
  
    // Create entries in player_cards for each drawn card
    const cardPromises = availableCards.items.map((card) =>
      pb.collection('player_cards').create({
        player_id: playerId,
        game_id: gameId,
        card_id: card.id,
        used: false
      })
    );
  
    await Promise.all(cardPromises);
  
    return availableCards.items; // Return drawn cards
  }
  