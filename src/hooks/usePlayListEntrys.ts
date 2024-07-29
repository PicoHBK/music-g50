import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { PlayListEntry } from "@/types/harmony";
import { useQuery } from "@tanstack/react-query";

const fetchPlayListEntries = async () => {
    const { data } = await apiHarmSongPublic.get<PlayListEntry[]>(`/playlist-entries`);
    return data;
  };
  
export function usePlaylistEntry() {
    const { data } = useQuery({
      queryKey: ["playlist-entries"],
      queryFn: fetchPlayListEntries,
      staleTime: Infinity,
    });
  
    return { data };
  }