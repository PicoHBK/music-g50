import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { PagSongType } from "@/types/harmony";
import { QueryFunctionContext, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";


const fetchSongs = async (ctx:QueryFunctionContext) => {
    const [_, pageNum] = ctx.queryKey
    void _;
    const { data } = await apiHarmSongPublic.get<PagSongType>(`/songs?page=${pageNum}`);
    return data;
  };


  export function useSongs(filterGenRes: number | string, filterAlbum: number | string, filterPlaylist: number[] | "all") {

    const [pageNum, setPageNum] = useState(1) 
    const [hasNextPage,setHasNextPage] = useState(false) 
    const [hasPrevPage,setHasPrevPage] = useState(false) 
    const { data, isLoading, isSuccess} = useQuery({
        queryKey: ["songs", pageNum], 
        queryFn: fetchSongs,
        staleTime: Infinity,
    });

    useEffect(() =>{
        if(isSuccess && data.next){
            setHasNextPage(true)
        }else{
            setHasNextPage(false)
        }

        if(isSuccess && data.previous){
            setHasPrevPage(true)
        }else{
            setHasPrevPage(false)
        }

    },[isSuccess, data])

    let filteredSongs = data?.results;


    if (!isLoading && data) {
        if (filterGenRes !== "all") {
            filteredSongs = filteredSongs?.filter((song) =>
                song.genres.includes(filterGenRes)
            );
        }

        if (filterPlaylist !== "all") {
            filteredSongs = filteredSongs?.filter((song) =>
                filterPlaylist.includes(song.id)
            );
        }
        if (filterAlbum !== "all") {
            filteredSongs = filteredSongs?.filter(
                (song) => song.album === filterAlbum
            );
        }
    }

    return { data: filteredSongs, isLoading, setPageNum, hasNextPage, hasPrevPage};
}