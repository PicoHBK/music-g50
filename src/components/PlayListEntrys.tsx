import { useAuthContext } from "@/hooks/useAuth"
import SongInPlayList from "./SongInPlayList"
import apiHarmSongPublic from "@/apis/publicHarmonySong"
import { QueryFunctionContext, useQuery } from "@tanstack/react-query"
import { PagPlayListType } from "@/types/harmony"

const fetchPlaylistById = async (ctx:QueryFunctionContext)=> {
  const [_, id] = ctx.queryKey
  void _;
  const {data} = await apiHarmSongPublic.get<PagPlayListType>(`/playlists?owner=${id}`)
  return data.results
}

function usePlayListById(id:number) {
  const {data:playlists} =useQuery({
    queryKey: ['playlistsById', id],
    queryFn: fetchPlaylistById,
    staleTime:1000
  })


  return {playlists}

}



function PlayListEntrys({idSong, id}:{idSong:number, id:number}) {
  const {playlists} = usePlayListById(id)
    
    const {state} = useAuthContext()
    
  return (
    <div>
        {
            playlists?.filter((playlist)=> playlist.owner === state.user?.user__id).map((playlist) =>(
                <SongInPlayList playlist={playlist} idSong={idSong} key={playlist.id}/>
            ))
        }
    </div>
  )
}

export default PlayListEntrys