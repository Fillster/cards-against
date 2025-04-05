import { useMutation } from '@tanstack/react-query';
import pb from '@/lib/pocketbase';

interface BlackCard {
    id: string;
    text: string;
    type: string;
    pack: number;
    pick: number;
}

// Function to draw a random black card
const drawBlackCard = async (): Promise<BlackCard> => {
    try {
        const records = await pb.collection('cards').getFullList<BlackCard>({
            filter: "type='black'"
        });

        if (records.length === 0) {
            throw new Error("No black cards available");
        }

         return records[Math.floor(Math.random() * records.length)];
       
    } catch (error) {
        console.error("PocketBase Fetch Error:", error);
        throw error;
    }
};


// React Query hook for drawing a black card
export const useDrawBlackCard = () => {
    return useMutation({
        mutationFn: drawBlackCard,
        onError: (error) => {
            console.error("Error drawing black card:", error);
        }
    });
};
