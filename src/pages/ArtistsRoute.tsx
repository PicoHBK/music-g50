import CardArtist from "@/components/CardArtist";
import { useArtists } from "@/hooks/useArtists";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ArtistForm from "@/components/forms/ArtistForm";
import ArtistEdit from "@/components/forms/ArtistEdit";
import { useAuthContext } from "@/hooks/useAuth";
import { useState } from "react";
import apiHarmSongPublic from "@/apis/publicHarmonySong";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlbums } from "@/hooks/useAlbums";

const deleteArtist = async (id: number) => {
  const token = localStorage.getItem("token");
  const { data } = await apiHarmSongPublic.delete(`/artists/${id}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return data;
};

function ArtistsRoute() {
  const { dataPag, hasNextPage, fetchNextPage } = useArtists();
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
      queryClient.invalidateQueries({ queryKey: ["artists"] });
      if (data.code === "ERR_BAD_REQUEST") {
        console.log("Algo salio mal");
      }
      setLoading(false);
    },
  });

  const { data: albums } = useAlbums();

  const confirmDeleteArtist = (id: number) => {
    mutate(id);
    setBorrar(false);
  };

  return (
    <div className="flex w-full gap-16">
      <div className="flex flex-wrap w-full lg:max-w-[800px] gap-4">
        {dataPag?.pages.map((page) =>
          page.results.map((artist) => (
            <Dialog key={artist.id}>
              <DialogTrigger
                className="rounded-lg p-2 flex flex-col items-center"
                onClick={() => {
                  setEdit(false);
                  setBorrar(false);
                }}
              >
                <CardArtist artist={artist} />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{artist.name}</DialogTitle>
                  <DialogDescription>{artist.bio}</DialogDescription>
                </DialogHeader>
                {!edit && (
                  <div className="flex flex-wrap gap-2 items-start">
                    {albums
                      ?.filter((album) => album.artist === artist.id)
                      .map((album) => (
                        <div
                          className="flex flex-col max-w-24 hover:scale-105 transition"
                          key={album.id}
                        >
                          <div className="w-16 h-24 text-center">
                            <img
                              src={
                                album.cover ||
                                "https://wallpaper.forfun.com/fetch/02/02d248d9eeaf7c12258f6ea6e1d445c1.jpeg?h=900&r=0.5"
                              }
                              alt="album"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <p className="text-sm font-semibold text-myprim-800">
                            {album.year}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
                {!edit ? (
                  <div className="flex flex-col gap-2">
                    <a
                      href={artist.website}
                      className="text-mysec-500 font-bold text-sm"
                    >
                      Web
                    </a>
                    {state.user?.user__id === artist.owner && !borrar && (
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
                  <ArtistEdit artist={artist} />
                )}
                {borrar && (
                  <div className="flex flex-col gap-2 items-center">
                    <p>Seguro quieres eliminar el artista permanentemente?</p>
                    {!loading ? (
                      <button
                        onClick={() => {
                          confirmDeleteArtist(artist.id);
                        }}
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
        )}

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
            <p className="text-myprim-800">Agregar Artista</p>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Artista</DialogTitle>
              <DialogDescription>Artistas</DialogDescription>
            </DialogHeader>
            <ArtistForm />
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}

export default ArtistsRoute;
