import { useMutation, useQueryClient } from '@tanstack/react-query';
import pb from '@/lib/pocketbase';


interface RoundData {
    game_id: string;
    black_card_id: string;
    status: string;
    czar_id: string;
}

const createRound = async (data: RoundData) => {
    return await pb.collection('rounds').create(data);
};

export const useCreateRound = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: RoundData) => createRound(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['rounds'] });
        },
        onError: (error) => {
            console.error("Error creating round:", error);
        }
    });
};
