
import apiHarmSongPublic from "@/apis/publicHarmonySong";
import PlayListEdit from "@/components/forms/PlayListEdit";
import PlayListForm from "@/components/forms/PlayListForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthContext } from "@/hooks/useAuth";
import { usePlaylists } from "@/hooks/usePlayLists";
import Songs from "@/sections/Songs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const deletePlayList = async (id:number) => {
  const token = localStorage.getItem("token")
  const { data } = await apiHarmSongPublic.delete(`/playlists/${id}`,{
    headers: {
      Authorization: `Token ${token}`
    },
  }); 
  return data;
}




function PlayListsRoute() {
  const { data: playlists, dataPag, hasNextPage,fetchNextPage } = usePlaylists();
  const [edit, setEdit] = useState(false)
  const [borrar, setBorrar] = useState(false)
  const [loading, setLoading] = useState(false)
  const {state} = useAuthContext()
  const queryClient = useQueryClient();

  const { mutate} = useMutation({
    mutationFn: deletePlayList,
    onMutate: () => {
      console.log("Borrando la playlist");
      setBorrar(true);
      setLoading(true);
    },
    onSuccess: (data) => {
      
      console.log("song borrada");
      console.log(JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ['playlists'] })
      if(data.code === "ERR_BAD_REQUEST"){
        console.log("Algo salio mal")
      }
    },
  });

  const confirmDeletePlayList = (id:number) => {
    mutate(id);
    setBorrar(false)
  }
  return (
    <div className="flex w-full">
      <div className="flex flex-wrap justify-start items-start gap-1 max-w-[900px]">
        {/* {playlists?.map((playlist) => (
          <Dialog key={playlist.id}>
            <DialogTrigger className="rounded-lg p-1 flex flex-col items-center" onClick={() => {setEdit(false); setBorrar(false)}}>
              <div
                className="flex flex-col text-myprim-800 bg-myprim-200 px-4 py-2 rounded-lg hover:scale-105 transition select-none"
                key={playlist.id}
              >
                <div className="flex items-center">
                  <div className="h-10 w-10">
                    <img
                      src="https://img.icons8.com/?size=100&id=0noXTg95F2Al&format=png&color=000000"
                      alt="play list"
                      className="w-full h-full object-fill"
                    />
                  </div>
                  <h4 className="text-myprim-800 font-bold">{playlist.name}</h4>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{playlist.name}</DialogTitle>
                <DialogDescription>{playlist.description}</DialogDescription>
              </DialogHeader>
              <Songs filterAlbum={"all"} filterGenRes={"all"} filterPlayList={playlist.entries}/>
              {!edit ?
              <div className="flex flex-col gap-2">
                {(state.user?.user__id === playlist.owner && !borrar) && <div className="flex gap-2">
                  <button className="bg-mywarn-500 py-1 px-3 text-mywarn-100 rounded-lg hover:scale-105 transition" onClick={() => setEdit(true)}>Editar</button>
                  <button className="bg-myerror-500 py-1 px-3 text-myerror-100 rounded-lg hover:scale-105 transition" onClick={() => setBorrar(true)}>Borrar</button>
                </div>}
              </div>
            :<PlayListEdit playlist={playlist}/>}
            {borrar && <div className="flex flex-col gap-2 items-center">
              <p>Seguro quieres eliminar la playlist permanentemente?</p>
              {!loading ? <button 
              onClick={() => {confirmDeletePlayList(playlist.id)}}
              className="px-6 py-1 bg-myerror-100 text-myerror-400 rounded-lg hover:scale-105 transition active:scale-95">Si</button>:
              <p>Borrando</p>}
              </div>}
            </DialogContent>
          </Dialog>
        ))} */}
        {dataPag?.pages.map(page => (
  page.results.map(playlist => (
    <Dialog key={playlist.id}>
      <DialogTrigger
        className="rounded-lg p-1 flex flex-col items-center"
        onClick={() => {
          setEdit(false);
          setBorrar(false);
        }}
      >
        <div
          className="flex flex-col text-myprim-800 bg-myprim-200 px-4 py-2 rounded-lg hover:scale-105 transition select-none"
        >
          <div className="flex items-center">
            <div className="h-10 w-10">
              <img
                src="https://img.icons8.com/?size=100&id=0noXTg95F2Al&format=png&color=000000"
                alt="play list"
                className="w-full h-full object-fill"
              />
            </div>
            <h4 className="text-myprim-800 font-bold">{playlist.name}</h4>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{playlist.name}</DialogTitle>
          <DialogDescription>{playlist.description}</DialogDescription>
        </DialogHeader>
        <Songs
          filterAlbum="all"
          filterGenRes="all"
          filterPlayList={playlist.entries}
        />
        {!edit ? (
          <div className="flex flex-col gap-2">
            {(state.user?.user__id === playlist.owner && !borrar) && (
              <div className="flex gap-2">
                <button
                  className="bg-mywarn-500 py-1 px-3 text-mywarn-100 rounded-lg hover:scale-105 transition"
                  onClick={() => setEdit(true)}
                >
                  Editar
                </button>
                <button
                  className="bg-myerror-500 py-1 px-3 text-myerror-100 rounded-lg hover:scale-105 transition"
                  onClick={() => setBorrar(true)}
                >
                  Borrar
                </button>
              </div>
            )}
          </div>
        ) : (
          <PlayListEdit playlist={playlist} />
        )}
        {borrar && (
          <div className="flex flex-col gap-2 items-center">
            <p>Seguro quieres eliminar la playlist permanentemente?</p>
            {!loading ? (
              <button
                onClick={() => { confirmDeletePlayList(playlist.id); }}
                className="px-6 py-1 bg-myerror-100 text-myerror-400 rounded-lg hover:scale-105 transition active:scale-95"
              >
                Sí
              </button>
            ) : (
              <p>Borrando</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  ))
))}
{hasNextPage && (
          <button
            className="flex items-center p-2 text-myprim-800 rounded-full bg-myprim-300 hover:scale-110 transition active:scale-100"
            onClick={() => fetchNextPage()}
          >
            Cargar Mas
          </button>
        )}

      </div>
      
      <section>
        <Dialog>
          <DialogTrigger className="rounded-lg p-2 flex flex-col items-center">
            <div className="w-10 h-10 hover:scale-110 transition active:scale-100">
              <img
                src="https://img.icons8.com/?size=100&id=24717&format=png&color=15AED5"
                alt="add"
                className="w-full h-full object-fill"
              />
            </div>
            <p className="text-myprim-800">Crear PlayList</p>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva PlayList</DialogTitle>
              <DialogDescription>Crea tu propia playlist</DialogDescription>
            </DialogHeader>
            <PlayListForm />
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}

export default PlayListsRoute;
