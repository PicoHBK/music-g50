import { useQuery } from "@tanstack/react-query";
import apiHarmSongPublic from "../apis/publicHarmonySong";
import AlbumCard from "../components/CardAlbum"
import { AlbumType } from "../types/harmony";

const fetchAlbums = async () => {
    const { data } = await apiHarmSongPublic.get<AlbumType[]>(`/albums`);
    return data;
}

function useAlbums() {
    const { data } = useQuery({
        queryKey: ["albums"],
        queryFn: fetchAlbums,
        staleTime: Infinity,
    });

    return {data}
}

function Albums() {
    const { data:albums } = useAlbums();

  return (
    <div className="max-w-24 w-full lg:max-w-[348px] max-h-[388px]">
        <h2 className="text-lg font-bold text-myprim-600">Albums</h2>
        
        <div className="flex flex-wrap w-full max-h-[388px] justify-start items-start gap-5 overflow-y-scroll no-scrollbar">
            {
                albums?.map((album) =>(
                    <AlbumCard album={album} key={album.id}/>

                ))
            }
            
        </div>
    </div>
  )
}

export default Albums