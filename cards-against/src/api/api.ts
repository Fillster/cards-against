import pb from "@/lib/pocketbase";


interface Rounds {
    id: string;
    black_card_id: string;
    status: string;
    czar_id: string; // Add this if there are additional dynamic fields
  }


export async function getCurrentRoundByGameId(player_game_id: string | null) {
    if (!player_game_id) {
        // Handle the null or empty case
        console.warn('player_game_id is null or undefined. Exiting function.');
        return null; // or throw an error, depending on your use case
    }

    try {
        // Fetch the first record where game_id matches the given player_game_id
        const round = await pb.collection('rounds').getFirstListItem<Rounds>(`game_id="${player_game_id}"`, {});
        
        return round; // Return the fetched round
    } catch (error) {
        console.error('Error fetching current round:', error);
        throw error; // Optionally rethrow the error for further handling
    }
}


