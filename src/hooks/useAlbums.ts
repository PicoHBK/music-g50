import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { PagAlbumType } from "@/types/harmony";

import { useInfiniteQuery, useQuery} from "@tanstack/react-query";

const fetchAlbums = async () => {
    const { data } = await apiHarmSongPublic<PagAlbumType>(`/albums`);
    return data;
}

const fetchAlbumsPag = async ({ pageParam }: { pageParam: number }) => {
    const { data } = await apiHarmSongPublic.get<PagAlbumType>(`/albums?page=${pageParam}&page_size=30`);
    return data;
  };



export function useAlbums() {
    const { data } = useQuery({
        queryKey: ["albums"],
        queryFn: fetchAlbums,
        staleTime: Infinity,
    });

    const {
        data:dataPag,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
      } = useInfiniteQuery({
        queryKey: ['albums-infinity'],
        queryFn: fetchAlbumsPag,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          const nextPage = lastPage.next !== null ? lastPageParam + 1 : undefined 
          console.log(allPages.fill)
          return nextPage;
        },
        staleTime: Infinity,
        retry: 3
      });

    const filterAlbums  = data?.results

    return {data: filterAlbums, dataPag ,fetchNextPage ,hasNextPage, isFetchingNextPage}
}