import { useGenRes } from "@/hooks/useGenRes";
import Songs from "@/sections/Songs";
import { GenResType } from "@/types/harmony";
import { ChangeEvent, FormEvent, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import GenResForm from "@/components/forms/GenResForm";
import { useAuthContext } from "@/hooks/useAuth";
import apiHarmSongPrivate from "@/apis/privateHarmonySong";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiHarmSongPublic from "@/apis/publicHarmonySong";

const putPlayList = (formData: GenResType) => {
  const token = localStorage.getItem("token");
  return apiHarmSongPrivate
    .put<GenResType>(`/harmonyhub/genres/${formData.id}`, formData, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

const deleteGenRes = async (id: number) => {
  const token = localStorage.getItem("token");
  const { data } = await apiHarmSongPublic.delete(`/genres/${id}`, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return data;
};

function GenRes() {
  const [gen, setGen] = useState<GenResType | null>(null);
  const { state } = useAuthContext();
  const [edit, setEdit] = useState(false);
  const [borrar, setBorrar] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: putPlayList,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      setEdit(!edit);
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      setLoading(false);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteGenRes,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: () => {
      setEdit(!edit);
      queryClient.invalidateQueries({ queryKey: ["genres"] });
      setLoading(false);
      setGen(null);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const { data: genRes, dataPag, hasNextPage, fetchNextPage } = useGenRes();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    gen && setGen({ ...gen, [name]: value });
  };

  const cancelEdit = (gen: GenResType | null) => {
    setGen(gen);
    setEdit(false);
  };

  const deleteGenresSubmit = (id: number) => {
    deleteMutate(id);
  };

  const submitEdit = (e: FormEvent) => {
    e.preventDefault();
    console.log(gen);
    gen && mutate(gen);
  };
  return (
    <div className="flex flex-col w-full">
      <div className="flex">
        <div className="flex flex-wrap items-center gap-2 w-2/3 h-24">
          {dataPag?.pages.map((page) =>
            page.results.map((genre) => (
              <button
                key={genre.id}
                className="flex justify-center items-center bg-myprim-600 text-myprim-50 px-4 py-2 text-lg rounded-lg hover:scale-105 transition"
                onClick={() => {
                  setGen(genre);
                  setBorrar(false);
                  setEdit(false);
                }}
              >
                <h4>{genre.name}</h4>
              </button>
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
        <div className="flex flex-col w-1/3 px-4 py-2 ">
          {gen && (
            <div className="flex flex-col gap-3 bg-myprim-100 rounded-lg text-myprim-700 px-4 py-2">
              {!edit ? (
                <>
                  <h6 className="text-lg font-semibold text-myprim-800">
                    {gen.name}
                  </h6>
                  <p className="text-md">{gen.description}</p>
                </>
              ) : (
                <form
                  className="flex flex-col w-full gap-2"
                  onSubmit={submitEdit}
                >
                  <input
                    name="name"
                    type="text"
                    value={gen.name}
                    className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <textarea
                    name="description"
                    rows={4}
                    cols={50}
                    placeholder="Descripción"
                    className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
                    onChange={handleChange}
                    value={gen.description}
                  />
                  <div className="flex gap-3 justify-center">
                    <button
                      type="submit"
                      className="bg-mywarn-400 py-1 px-3 text-mywarn-50 rounded-lg hover:bg-mywarn-300"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="bg-myerror-400 py-1 px-3 text-mywarn-50 rounded-lg hover:bg-myerror-300"
                      onClick={() =>
                        cancelEdit(
                          genRes?.find((genres) => genres.id == gen.id) || null
                        )
                      }
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
              {borrar && (
                <>
                  <p className="text-myerror-300 font-semibold text-center">
                    Eliminar permanentemente
                  </p>
                  <button
                    className="bg-myerror-200 text-myerror-500 rounded-lg py-1 hover:bg-myerror-300"
                    onClick={() => deleteGenresSubmit(gen.id)}
                  >
                    Si
                  </button>
                </>
              )}

              {state.user?.user__id === gen.owner &&
                !edit &&
                !borrar &&
                !loading && (
                  <div className="flex gap-2">
                    <button
                      className="bg-mywarn-500 py-1 px-3 text-mywarn-100 rounded-lg hover:scale-105 transition"
                      onClick={() => setEdit(!edit)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-myerror-500 py-1 px-3 text-myerror-100 rounded-lg hover:scale-105 transition"
                      onClick={() => setBorrar(!borrar)}
                    >
                      Borrar
                    </button>
                  </div>
                )}
            </div>
          )}
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
                <p className="text-myprim-800">Agregar Genero</p>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crear Genero</DialogTitle>
                  <DialogDescription>
                    Por favor no repita géneros ya existentes
                  </DialogDescription>
                </DialogHeader>
                <GenResForm />
              </DialogContent>
            </Dialog>
          </section>
        </div>
      </div>
      {gen && (
        <Songs
          filterGenRes={gen?.id}
          filterAlbum={"all"}
          filterPlayList={"all"}
        />
      )}
    </div>
  );
}

export default GenRes;
