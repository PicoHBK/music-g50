import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { ArtistType } from "@/types/harmony";
import { useQuery } from "@tanstack/react-query";

const fetchArtists = async () => {
    const { data } = await apiHarmSongPublic.get<ArtistType[]>(`/artists`);
    return data;
}

export function useArtists() {
    const { data } = useQuery({
        queryKey: ["artists"],
        queryFn: fetchArtists,
        staleTime: Infinity,
    });

    return {data}
}