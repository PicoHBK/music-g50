import React from "react";
import { useQueries } from "@tanstack/react-query";
import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { SongsType } from "@/types/harmony";
import { usePlaylistContext } from "@/hooks/usePlayListContext";

// Función para obtener los detalles de una canción por ID
const fetchSong = async (id: number): Promise<SongsType> => {
  const { data } = await apiHarmSongPublic.get<SongsType>(`songs/${id}`);
  return data;
};

// Hook personalizado para obtener detalles de múltiples canciones
const useSongsByIds = (ids: number[]) => {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ["song", id],
      queryFn: () => fetchSong(id),
      staleTime: Infinity,
    })),
    combine: (results) => {
      return {
        songs: results
          .map((result) => result.data)
          .filter((data): data is SongsType => data !== undefined),
        isLoading: results.some((result) => result.isLoading),
        error: results.find((result) => result.isError)?.error,
      };
    },
  });
};

const SongsById: React.FC<{ ids: number[] }> = ({ ids }) => {
  const { songs } = useSongsByIds(ids);
  const { state } = usePlaylistContext();

  return (
    <div>
      <ul className="flex flex-col w-full font-lato">
        {songs.map((song) => (
          <li
            key={song.id}
            className={state.currentSong === song.id ? "flex w-full bg-myprim-400 items-center py-2 border-b border-gray-300 gap-8 hover:bg-myprim-200 p-2 rounded-md":"flex w-full items-center py-2 border-b border-gray-300 gap-8 hover:bg-myprim-200 p-2 rounded-md"}
          >
            <p className="flex-1 text-left font-semibold text-myprim-800">
              {song.title}
            </p>
            {/* <div className="flex items-center">
              <p className="text-center">{song.duration ? formatSeconds(song.duration) : "0:00"}</p>
            </div> */}
            {/* <button className="w-8 h-8 flex items-center justify-center hover:scale-110" onClick={()=> dispatch({type:"SET_SONG",payload:song})}>
              <img
                src="https://img.icons8.com/?size=100&id=80556&format=png&color=000000"
                alt="play"
                className="w-full h-full object-fill"
              />
            </button> */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SongsById;

/* const formatSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}; */
