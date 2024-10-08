import { useAlbums } from "@/hooks/useAlbums";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useAuthContext } from "@/hooks/useAuth";
import { useState } from "react";
import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CardAlbum from "@/components/CardAlbum";
import AlbumForm from "@/components/forms/AlbumForm";
import AlbumEdit from "@/components/forms/AlbumEdit";
import Songs from "@/sections/Songs";
import { useArtists } from "@/hooks/useArtists";

const deleteArtist = async (id: number) => {
  const token = localStorage.getItem("token");
  const { data } = await apiHarmSongPublic.delete(`/albums/${id}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return data;
};

function AlbumsRoute() {
  const {
    //data: albums,
    dataPag: albumsPag,
    hasNextPage,
    fetchNextPage,
  } = useAlbums();
  const { data: artists } = useArtists();
  const { state } = useAuthContext();
  const [edit, setEdit] = useState(false);
  const [borrar, setBorrar] = useState(false);
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteArtist,
    onMutate: () => {
      console.log("Borrando la artista");
      setBorrar(true);
      setLoading(true);
    },
    onSuccess: (data) => {
      console.log("song borrada");
      console.log(JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ["albums"] });
      if (data.code === "ERR_BAD_REQUEST") {
        console.log("Algo salio mal");
      }
    },
  });

  const confirmDeleteAlbum = (id: number) => {
    mutate(id);
    setBorrar(false);
  };
  return (
    <div className="flex flex-wrap justify-start items-start gap-5">
      {albumsPag?.pages.map((page) =>
        page.results.map((album) => (
          <Dialog key={album.id}>
            <DialogTrigger
              className="rounded-lg p-2 flex flex-col items-center"
              onClick={() => {
                setEdit(false);
                setBorrar(false);
              }}
            >
              <CardAlbum album={album} />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{album.title}</DialogTitle>
                <DialogDescription>{album.year}</DialogDescription>
              </DialogHeader>
              {!edit && !borrar && (
                <Songs filters={{ filterAlbum: album.id }} />
              )}
              {!edit ? (
                <div className="flex flex-col gap-2">
                  {state.user?.user__id === album.owner && !borrar && (
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
                <AlbumEdit album={album} />
              )}
              {borrar && (
                <div className="flex flex-col gap-2 items-center">
                  <p>Seguro quieres eliminar el album permanentemente?</p>
                  {!loading ? (
                    <button
                      onClick={() => {
                        confirmDeleteAlbum(album.id);
                      }}
                      className="px-6 py-1 bg-myerror-100 text-myerror-400 rounded-lg hover:scale-105 transition active:scale-95"
                    >
                      Si
                    </button>
                  ) : (
                    <p>Borrando</p>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        ))
      )}

      {hasNextPage && (
        <button
          className=" p-2 text-myprim-800 rounded-full bg-myprim-300 hover:scale-110 transition active:scale-100"
          onClick={() => fetchNextPage()}
        >
          Cargar Mas
        </button>
      )}

      {state.auth && <section>
        <Dialog>
          <DialogTrigger className="rounded-lg p-2 flex flex-col items-center">
            <div className="w-10 h-10 hover:scale-110 transition active:scale-100">
              <img
                src="https://img.icons8.com/?size=100&id=24717&format=png&color=15AED5"
                alt="add"
                className="w-full h-full object-fill"
              />
            </div>
            <p className="text-myprim-800">Agregar Album</p>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo Album</DialogTitle>
              <DialogDescription>Llene todo los campos</DialogDescription>
            </DialogHeader>
            {artists &&
            artists?.filter((artist) => artist.owner === state.user?.user__id)
              .length > 0 ? (
              <AlbumForm />
            ) : (
              <p className="text-myerror-500 bg-myerror-200 p-2 rounded font-semibold">
                Por Favor Crear al menos un Artista para crear un album
              </p>
            )}
          </DialogContent>
        </Dialog>
      </section>}
    </div>
  );
}

export default AlbumsRoute;
