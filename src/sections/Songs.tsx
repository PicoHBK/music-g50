import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiHarmSongPublic from "../apis/publicHarmonySong";
import { useAuthContext } from "@/hooks/useAuth";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";



import SongEdit from "@/components/forms/SongEdit";
import PlayListEntrys from "@/components/PlayListEntrys";
import { useSongs } from "@/hooks/useSongs";
import { usePlaylistContext } from "@/hooks/usePlayListContext";

interface UseSongsArgsType {
  filterArtist?: number;
  filterAlbum?: number;
  filterPlayList?: number;
  filterGenre?: number;
}

const deleteSong = async (id: number) => {
  const token = localStorage.getItem("token");
  const { data } = await apiHarmSongPublic.delete(`/songs/${id}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return data;
};

function Songs({ filters = {} }: { filters: UseSongsArgsType }) {
  const { dispatch,state:statePlayList } = usePlaylistContext()
  const { state } = useAuthContext();
  const [showDialog, setShowDialog] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: songs,
    hasNextPage,
    hasPrevPage,
    setPageNum,
  } = useSongs(filters);

  const { mutate } = useMutation({
    mutationFn: deleteSong,
    onMutate: () => {
      console.log("Borrando la song");
    },
    onSuccess: (data) => {
      console.log("song borrada");
      console.log(JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ["songs"] });
      if (data.code === "ERR_BAD_REQUEST") {
        console.log("Algo salio mal");
      }
    },
  });

 
  const borrarSong = (id: number) => {
    mutate(id);
    setShowDialog(false);
  };

  return (
    <div className="w-full max-w-[700px]">
      <div className="flex  flex-col overflow-x-auto justify-center items-center gap-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-myprim-100 text-myprim-900">
              <th className="px-4 py-2 text-center font-normal">#</th>
              <th className="px-4 py-2 text-center font-normal"></th>
              <th className="px-4 py-2 text-center font-normal"></th>
              <th className="px-4 py-2 text-center font-normal">Nombre</th>
              <th className="px-4 py-2 text-center font-normal">Duración</th>
              {state.auth && (
                <th className="px-4 py-2 text-center font-normal"></th>
              )}
              {state.auth && (
                <th className="px-4 py-2 text-center font-normal"></th>
              )}
            </tr>
          </thead>
          <tbody>
            {songs?.map((song, index) => (
      
                song.song_file&&<tr
                key={song.id}
                className={
                  song.song_file
                    ? "hover:bg-myprim-400 transition-colors"
                    : "bg-opacity-75 bg-myerror-100 cursor-not-allowed"
                }
              >
                <td className="px-4 py-2 text-center text-mydark-50 font-light select-none">
                  {index + 1}
                </td>
                <td>
                  <button
                    className="w-6 h-6 flex items-center justify-center hover:scale-110"
                    onClick={() =>
                      dispatch({ type:"REPLACE_PLAYLIST_WITH_SONG", payload: song.id })
                    }
                  >
                    <img
                      src="https://img.icons8.com/?size=100&id=80556&format=png&color=000000"
                      alt="play"
                      className="w-full h-full object-fill"
                    />
                  </button>
                </td>
                <td>
                  {!statePlayList.playlist.includes(song.id)?<button
                    className="w-4 h-4 flex items-center justify-center hover:scale-110"
                    onClick={() =>
                      dispatch({ type:"ADD_SONG", payload: song.id })
                    }
                  >
                    <img
                      src="https://img.icons8.com/?size=100&id=EQh9HbAEgYS9&format=png&color=015770"
                      alt="play"
                      className="w-full h-full object-fill"
                    />
                  </button>:<button
                    className="w-4 h-4 flex items-center justify-center hover:scale-110"
                    onClick={() =>
                      dispatch({ type:"REMOVE_SONG", payload: song.id })
                    }
                  >
                    <img
                      src="https://img.icons8.com/?size=100&id=13180&format=png&color=FF1919"
                      alt="play"
                      className="w-full h-full object-fill"
                    />
                  </button>}
                </td>
                <td className="px-4 py-2 text-center text-mydark-500 font-bold select-none">
                  {song.title}
                </td>
                <td className="px-4 py-2 text-center text-mydark-50 font-normal select-none">
                  {"1:23"}
                </td>
                {state.auth && (
                  <td>
                    <Popover>
                      <PopoverTrigger>
                        <div className="w-6 h-6 p-1 hover:scale-125 transition">
                          <img
                            src="https://img.icons8.com/?size=100&id=iROmEg6KbKwI&format=png&color=0087A9"
                            alt="edit"
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PlayListEntrys idSong={song.id} id={state.user?.user__id||1} />
                      </PopoverContent>
                    </Popover>
                  </td>
                )}
                {song.owner === state.user?.user__id && (
                  <td className="px-4 py-2 text-center">
                    <Popover>
                      <PopoverTrigger>
                        <div className="max-w-8 hover:cursor-pointer hover:scale-105 transition opacity-85">
                          <img
                            src="https://img.icons8.com/?size=100&id=uMEWjbCxNHQw&format=png&color=043154"
                            alt="menu"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="flex w-full gap-4 bg-mylight-600">
                        <Dialog>
                          <DialogTrigger>
                            <div className="w-6 h-6 p-1 bg-mywarn-400 rounded-full hover:scale-105 transition">
                              <img
                                src="https://img.icons8.com/?size=100&id=49&format=png&color=FFFFFF"
                                alt="edit"
                              />
                            </div>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Editar</DialogTitle>
                              <DialogDescription>
                                Solo puedes editar tus canciones
                              </DialogDescription>
                            </DialogHeader>
                            <SongEdit song={song} />
                          </DialogContent>
                        </Dialog>
                        <Dialog open={showDialog}>
                          <DialogTrigger onClick={() => setShowDialog(true)}>
                            <div className="w-6 h-6 p-1 bg-myerror-400 rounded-full hover:scale-105 transition">
                              <img
                                src="https://img.icons8.com/?size=100&id=3062&format=png&color=FFFFFF"
                                alt="edit"
                              />
                            </div>
                          </DialogTrigger>
                          <DialogContent className="flex flex-col justify-center items-center">
                            <DialogHeader>
                              <DialogTitle>Estas seguro?</DialogTitle>
                            </DialogHeader>
                            <DialogFooter>
                              <button
                                onClick={() => borrarSong(song.id)}
                                className="bg-myerror-400 text-myerror-100 py-2 px-6 rounded-lg hover:scale-105 transition"
                              >
                                Si
                              </button>
                              <button
                                onClick={() => setShowDialog(false)}
                                className="bg-mylight-900 text-mydark-800 py-2 px-6 rounded-lg hover:scale-105 transition"
                              >
                                No
                              </button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </PopoverContent>
                    </Popover>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <section className="flex justify-center gap-4">
          {hasPrevPage && (
            <button
              className="w-5 h-5"
              onClick={() => setPageNum((prev) => prev - 1)}
            >
              <img
                src="https://img.icons8.com/?size=100&id=L7zmVGbt7359&format=png&color=000000"
                alt="next"
                className="w-full h-full object-fill"
              />
            </button>
          )}
          {hasNextPage && (
            <button
              className="w-5 h-5"
              onClick={() => setPageNum((prev) => prev + 1)}
            >
              <img
                src="https://img.icons8.com/?size=100&id=BiU5bOFL0yf8&format=png&color=000000"
                alt="next"
                className="w-full h-full object-fill"
              />
            </button>
          )}
        </section>
      </div>
    </div>
  );
}

export default Songs;
