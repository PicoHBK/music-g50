import { useArtists } from "@/hooks/useArtists";
import CardArtist from "../components/CardArtist"


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