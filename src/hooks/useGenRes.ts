import apiHarmSongPublic from "@/apis/publicHarmonySong";
import {PagGenResType } from "@/types/harmony";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const fetchGenResPag = async ({ pageParam }: { pageParam: number }) => {
  const { data } = await apiHarmSongPublic.get<PagGenResType>(`/genres?page=${pageParam}`);
  return data;
};

const fetchGenRes = async () =>{
    const{data} = await apiHarmSongPublic.get<PagGenResType>("/genres")
    return data;
  }
  
  export function useGenRes(){

    const {
      data:dataPag,
      fetchNextPage,
      isFetchingNextPage,
      hasNextPage,
    } = useInfiniteQuery({
      queryKey: ['genres-infinity'],
      queryFn: fetchGenResPag,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        const nextPage = lastPage.next !== null ? lastPageParam + 1 : undefined 
        console.log(allPages.fill)
        return nextPage;
      },
      staleTime: Infinity,
      retry: 3
    });


    const { data } = useQuery({
      queryKey: ["genres"],
      queryFn: fetchGenRes,
      staleTime: Infinity,
    });
  
    return{data:data?.results, dataPag, hasNextPage, fetchNextPage, isFetchingNextPage}
  }