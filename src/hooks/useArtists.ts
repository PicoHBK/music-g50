import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { PagArtistType } from "@/types/harmony";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const fetchArtists = async () => {
    const { data } = await apiHarmSongPublic.get<PagArtistType>(`/artists`);
    return data;
}

const fetchArtistPag = async ({ pageParam }: { pageParam: number }) => {
    const { data } = await apiHarmSongPublic.get<PagArtistType>(`/artists?page=${pageParam}`);
    return data;
  };


export function useArtists() {

    const {
        data:dataPag,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
      } = useInfiniteQuery({
        queryKey: ['artists-infiity'],
        queryFn: fetchArtistPag,
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
        queryKey: ["artists"],
        queryFn: fetchArtists,
        staleTime: Infinity,
    });

    return {data:data?.results, dataPag, hasNextPage, fetchNextPage, isFetchingNextPage}
}