import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { PagPlayListEntry} from "@/types/harmony";
import { useQuery } from "@tanstack/react-query";

const fetchPlayListEntries = async () => {
    const { data } = await apiHarmSongPublic.get<PagPlayListEntry>(`/playlist-entries`);
    return data;
  };
  
export function usePlaylistEntry() {
    const { data } = useQuery({
      queryKey: ["playlist-entries"],
      queryFn: fetchPlayListEntries,
      staleTime: Infinity,
    });
  
    return { data:data?.results };
  }