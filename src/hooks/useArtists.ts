import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { PagArtistType } from "@/types/harmony";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const fetchArtists = async () => {
    const { data } = await apiHarmSongPublic.get<PagArtistType>(`/artists`);
    return data;
}

const fetchArtistPag = async ({ pageParam }: { pageParam: number }) => {
    const { data } = await apiHarmSongPublic.get<PagArtistType>(`/artists?page=${pageParam}&page_size=30`);
    return data;
  };


export function useArtists() {

    const {
        data:dataPag,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
      } = useInfiniteQuery({
        queryKey: ['artists-infinity'],
        queryFn: fetchArtistPag,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          const nextPage = lastPage.next !== null ? lastPageParam + 1 : undefined 
          return nextPage;
          void allPages;
        },
        staleTime: Infinity,
        retry: 3
      });

    const { data } = useQuery({
        queryKey: ["artists"],
        queryFn: fetchArtists,
        staleTime: Infinity,
    });

    return {data:data?.results, dataPag, hasNextPage, fetchNextPage, isFetchingNextPage}
}