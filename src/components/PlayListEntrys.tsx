import { useAuthContext } from "@/hooks/useAuth"
import { usePlaylists } from "@/hooks/usePlayLists"
import SongInPlayList from "./SongInPlayList"



function PlayListEntrys({id}:{id:number}) {
    const {data:playlists} = usePlaylists()
    const {state} = useAuthContext()
    
  return (
    <div>
        {
            playlists?.filter((playlist)=> playlist.owner === state.user?.user__id).map((playlist) =>(
                <SongInPlayList playlist={playlist} idSong={id} key={playlist.id}/>
            ))
        }
    </div>
  )
}

export default PlayListEntrys