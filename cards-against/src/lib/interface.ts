export interface CreateGameData {
    playerId: string;
    name: string;
    status: string;
  };
  
export interface JoinGameData {
    gameId: string;
    playerId: string;
    score: number;
  };

 export interface Rounds {
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

export interface SubmissionData {
round_id: string;
card_id: string;
game_players_id: string;
}
