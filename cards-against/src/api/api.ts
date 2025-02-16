import pb from "@/lib/pocketbase";
import { CreateGameData, JoinGameData, Rounds, SubmissionData } from "@/lib/interface";


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
      console.log("DATA: ", data)
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
  



  export async function joinLobby(lobbyId: string, playerId: string) {
    const data = {
      lobby_id: lobbyId,
      player_id: playerId,
      is_ready: false,
    };
  
    try {
      const record = await pb.collection("lobby_players").create(data);
      return record;
    } catch (error: any) {
      console.error("Error joining lobby:", error.message);
      throw error;
    }
  }

  export async function createLobby(hostLobbyName: string, playerId: string) {
    const data = {
      max_players: 8,
      name: hostLobbyName,
      is_active: true,
      host_id: playerId,
    };
  
    try {
      const record = await pb.collection("lobbies").create(data);
      return record; // Return the created lobby
    } catch (error) {
      console.error("Error creating lobby:", error);
      throw error; // Allow caller to handle the error
    }
  }

// Create a new game
export const createGame = async ({
  playerId,
  name,
  status,
}: CreateGameData): Promise<string> => {
  try {
    const data = {
      name, // Game name
      host_id: playerId, // Host ID
      status, // Game status
    };

    const record = await pb.collection("games").create(data);
    console.log("Game created:", record);
    return record.id; // Assuming the created record has an `id` field
  } catch (err: any) {
    console.error("Failed to create game:", err);
    throw new Error(err.message || "Failed to create game");
  }
};

// Join a game with the player's score and ID
export const joinGame = async ({ gameId, playerId, score }: JoinGameData) => {
  try {
    const data = {
      game_id: gameId,
      score, // Score, which could be 0 or any other logic-based score
      player_id: playerId,
    };

    const record = await pb.collection("game_players").create(data);
    console.log("Player joined game:", record);
    return record.id;
  } catch (err: any) {
    console.error(`Failed to add player ${playerId} to game ${gameId}:`, err);
    throw new Error(err.message || `Failed to join game ${gameId}`);
  }
};


export const leaveGame = async (playerId: string) => {
  if (!playerId) throw new Error("Player ID is required to leave the game.");

  try {
    const playerRecord = await pb.collection("game_players").getFirstListItem(`player_id="${playerId}"`);
    if (!playerRecord) throw new Error("Player is not in any game.");

    await pb.collection("game_players").delete(playerRecord.id);
    console.log("Player left the game:", playerRecord);
  } catch (err: any) {
    console.error("Failed to leave game:", err);
    throw new Error(err.message || "Failed to leave game");
  }
};

export const fetchGames = async () => {
  try {
    const games = await pb.collection("games").getFullList();
    return games;
  } catch (err: any) {
    console.error("Failed to fetch games:", err);
    throw new Error(err.message || "Failed to fetch games");
  }
};
