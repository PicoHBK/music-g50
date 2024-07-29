import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { AlbumType } from "@/types/harmony";
import { useQuery } from "@tanstack/react-query";

const fetchAlbums = async () => {
    const { data } = await apiHarmSongPublic.get<AlbumType[]>(`/albums`);
    return data;
}
export function useAlbums() {
    const { data } = useQuery({
        queryKey: ["albums"],
        queryFn: fetchAlbums,
        staleTime: Infinity,
    });7
    

    return {data}
}