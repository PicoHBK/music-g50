import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { PlayListType } from "@/types/harmony";
import { useQuery } from "@tanstack/react-query";

const fetchPlayLists = async () => {
    const { data } = await apiHarmSongPublic.get<PlayListType[]>(`/playlists`);
    return data;
  };
  
export function usePlaylists() {
    const { data } = useQuery({
      queryKey: ["playlists"],
      queryFn: fetchPlayLists,
      staleTime: Infinity,
    });
  
    return { data };
  }