import { useGenRes } from "@/hooks/useGenRes";
import Songs from "@/sections/Songs";
import { GenResType } from "@/types/harmony";
import { useState } from "react";


function GenRes() {
  const [gen, setGen] = useState<GenResType | null>(null)

  const {data:genRes} = useGenRes()
  return (
    <div className="flex flex-col w-full">
      <div className="flex">
        <div className="flex flex-wrap items-center gap-2 w-2/3 h-24">
        {
          genRes?.map((genre) =>(
            <button key={genre.id} className=" flex justify-center items-center bg-myprim-600 text-myprim-50 px-4 py-2 text-lg rounded-lg hover:scale-105 transition" onClick={() => setGen(genre)}>
              <h4>{genre.name}</h4>
            </button>
          ))
        }
        </div>
        <div className="flex flex-col w-1/3 px-4 py-2 bg-myprim-100 rounded-lg text-myprim-700">
          {gen&&
          
          <div>
            <h6 className="text-lg font-semibold text-myprim-800">{gen.name}</h6>
            <p className="text-md">{gen.description}</p>
          </div>
          }
        </div>
      </div>
      {gen&&<Songs filter={gen?.id}/>}
      
      
      
    </div>
  )
}

export default GenRes