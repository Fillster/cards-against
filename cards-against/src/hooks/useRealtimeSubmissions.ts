import { useEffect } from "react";
import pb from "@/lib/pocketbase";

export function useRealtimeSubmissions(callback: (e: { action: string; record: any }) => void) {
  useEffect(() => {
    pb.collection("submissions").subscribe("*", callback);
    return () => pb.collection("submissions").unsubscribe("*");
  }, [callback]);
}
