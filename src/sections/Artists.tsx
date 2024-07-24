import { useQuery } from "@tanstack/react-query";
import CardArtist from "../components/CardArtist"
import { ArtistType } from "../types/harmony";
import apiHarmSongPublic from "../apis/publicHarmonySong";

const fetchArtists = async () => {
    const { data } = await apiHarmSongPublic.get<ArtistType[]>(`/artists`);
    return data;
}

function useArtists() {
    const { data } = useQuery({
        queryKey: ["artist"],
        queryFn: fetchArtists,
        staleTime: Infinity,
    });

    return {data}
}

function Artists() {
    const {data:artists} = useArtists();
  return (
    <div className="max-w-24 w-full lg:max-w-[348px] max-h-[388px]">
        <h2 className="text-lg font-bold text-mysec-400">Artistas</h2>
        
        <div className="flex flex-wrap w-full max-h-[388px] justify-start items-start gap-5 overflow-y-scroll no-scrollbar">
        {
                artists?.map((artist) =>(
                    <CardArtist artist={artist}/>

                ))
            }
            
            
        </div>
    </div>
  )
}

export default Artists