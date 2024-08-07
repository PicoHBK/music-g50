import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { PagSongType } from "@/types/harmony";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface UseSongsArgsType {
  filterArtist?: number;
  filterAlbum?: number;
  filterPlayList?: number;
  filterGenre?: number;
}

const buildUrl = (filters: UseSongsArgsType, pageNum: number) => {
  let url = '/songs'; // Ruta por defecto sin filtros

  // Construir la URL en función de los filtros activos
  switch (true) {
    case !!filters.filterAlbum:
      url = `/albums/${filters.filterAlbum}/songs`;
      break;
    case !!filters.filterArtist:
      url = `/artists/${filters.filterArtist}/songs`;
      break;
    case !!filters.filterPlayList:
      url = `/playlists/${filters.filterPlayList}/songs`;
      break;
    case !!filters.filterGenre:
      url = `/genres/${filters.filterGenre}/songs`;
      break;
    default:
      // Ruta por defecto si ningún filtro está presente
      url = `/songs`;
      break;
  }

  return `${url}?page=${pageNum}`;
};

const fetchSongs = async (ctx: QueryFunctionContext) => {
  const [_, filters, pageNum] = ctx.queryKey;
  void _;

  // Asegurarse de que `filters` tiene el tipo correcto
  const typedFilters: UseSongsArgsType = filters as UseSongsArgsType;
  const url = buildUrl(typedFilters, pageNum as number);

  const { data } = await apiHarmSongPublic.get<PagSongType>(url+"&page_size=30");
  return data;
};

export function useSongs(args: UseSongsArgsType = {}) {
  const { filterArtist, filterAlbum, filterPlayList, filterGenre } = args;
  const [pageNum, setPageNum] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["songs", { filterArtist, filterAlbum, filterPlayList, filterGenre }, pageNum],
    queryFn: fetchSongs,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setHasNextPage(!!data.next);
      setHasPrevPage(!!data.previous);
    } else {
      setHasNextPage(false);
      setHasPrevPage(false);
    }
  }, [isSuccess, data]);

  return { data:data?.results, isSuccess, isLoading, hasNextPage, hasPrevPage, setPageNum };
}
