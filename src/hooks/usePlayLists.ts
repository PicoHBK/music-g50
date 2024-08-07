import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { PagPlayListType} from "@/types/harmony";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const fetchPlayLists = async () => {
    const { data } = await apiHarmSongPublic.get<PagPlayListType>(`/playlists`);
    return data;
  };

  const fetchPlayListPag = async ({ pageParam }: { pageParam: number }) => {
    const { data } = await apiHarmSongPublic.get<PagPlayListType>(`/playlists?page=${pageParam}&page_size=30`);
    return data;
  };

  
export function usePlaylists() {

  const {
    data:dataPag,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['playlists-infiity'],
    queryFn: fetchPlayListPag,
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
      queryKey: ["playlists"],
      queryFn: fetchPlayLists,
      staleTime: Infinity,
    });
  
    return { data:data?.results ,dataPag,hasNextPage,fetchNextPage,isFetchingNextPage };
  }