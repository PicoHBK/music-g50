import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiHarmSongPublic from "../apis/publicHarmonySong";
import { SongsType } from "../types/harmony";
import { useSongsContext } from "../hooks/usePlayerSong";
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
import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SongEdit from "@/components/forms/SongEdit";

const fetchSongs = async () => {
  const { data } = await apiHarmSongPublic.get<SongsType[]>(`/songs`);
  return data;
};

const deleteSong = async (id:number) => {
  const token = localStorage.getItem("token")
  const { data } = await apiHarmSongPublic.delete(`/songs/${id}`,{
    headers: {
      Authorization: `Token ${token}`
    },
  });
  return data;
}



function useSongs(filter:string| number) {
  const { data } = useQuery({
    queryKey: ["songs"],
    queryFn: fetchSongs,
    staleTime: Infinity,
  });

  const filterSongs = filter !== "all" ? data?.filter((song) => song.genres.includes(filter)) : data

  return { data:filterSongs };
}
function Songs({filter="all"}:{filter:string | number}) {
  const { data } = useSongs(filter);
  const { dispatch } = useSongsContext();
  const { state } = useAuthContext();
  const [showDialog, setShowDialog] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteSong,
    onMutate: () => {
      console.log("Borrando la song");
    },
    onSuccess: (data) => {
      console.log("song borrada");
      console.log(JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ['songs'] })
      if(data.code === "ERR_BAD_REQUEST"){
        console.log("Algo salio mal")
      }
    },
  });


  const addToPlayer = (song: SongsType) => {
    if (song.song_file) {
      dispatch({ type: "SET_SONG", payload: song });
    } else {
      console.log("Sin File de la Musica por favor agregue una archivo");
    }
  };

  const borrarSong = (id:number) => {
    mutate(id);
    setShowDialog(false);
  }



  return (
    <div className="w-full max-w-[700px]">
      <h2 className="text-lg font-bold text-myprim-600">Canciones</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-myprim-100 text-myprim-900">
              <th className="px-4 py-2 text-center font-normal">#</th>
              <th className="px-4 py-2 text-center font-normal">Nombre</th>
              <th className="px-4 py-2 text-center font-normal">Duración</th>
              <th className="px-4 py-2 text-center font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {data?.map((song, index) => (
              <tr
                key={song.id}
                className={
                  song.song_file
                    ? "hover:bg-myprim-400 transition-colors"
                    : "bg-opacity-75 bg-myerror-100 cursor-not-allowed"
                }
                onClick={() => addToPlayer(song)}
              >
                <td className="px-4 py-2 text-center text-mydark-50 font-light select-none">
                  {index + 1}
                </td>
                <td className="px-4 py-2 text-center text-mydark-500 font-bold select-none">
                  {song.title}
                </td>
                <td className="px-4 py-2 text-center text-mydark-50 font-normal select-none">
                  {"1:23"}
                </td>
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
                              <DialogTitle>
                                Editar
                              </DialogTitle>
                              <DialogDescription>
                                Solo puedes editar tus canciones
                              </DialogDescription>
                            </DialogHeader>
                            <SongEdit song={song}/>
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
                              <DialogTitle>
                                Estas seguro?
                              </DialogTitle>
                            </DialogHeader>
                            <DialogFooter>
                              <button 
                              onClick={() => borrarSong(song.id)}
                              className="bg-myerror-400 text-myerror-100 py-2 px-6 rounded-lg hover:scale-105 transition">
                                Si
                              </button>
                              <button 
                              onClick={() => setShowDialog(false)}
                              className="bg-mylight-900 text-mydark-800 py-2 px-6 rounded-lg hover:scale-105 transition">
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
      </div>
    </div>
  );
}

export default Songs;
