import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { GenResType } from "@/types/harmony";
import { useQuery } from "@tanstack/react-query";

const fetchGenRes = async () =>{
    const{data} = await apiHarmSongPublic.get<GenResType[]>("/genres")
    return data;
  }
  
  export function useGenRes(){
    const { data } = useQuery({
      queryKey: ["genres"],
      queryFn: fetchGenRes,
      staleTime: Infinity,
    });
  
    return{data}
  }