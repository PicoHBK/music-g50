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

const deleteArtist = async (id:number) => {
  const token = localStorage.getItem("token")
  const { data } = await apiHarmSongPublic.delete(`/artists/${id}`,{
    headers: {
      Authorization: `Token ${token}`
    },
  }); 
  return data;
}


function ArtistsRoute() {
  const { data: artists } = useArtists();
  const {state} = useAuthContext()
  const [edit, setEdit] = useState(false)
  const [borrar, setBorrar] = useState(false)
  const [loading, setLoading] = useState(false)

  const queryClient = useQueryClient();

  const { mutate} = useMutation({
    mutationFn: deleteArtist,
    onMutate: () => {
      console.log("Borrando la artista");
      setBorrar(true);
      setLoading(true);
    },
    onSuccess: (data) => {
      
      console.log("song borrada");
      console.log(JSON.stringify(data));
      queryClient.invalidateQueries({ queryKey: ['artists'] })
      if(data.code === "ERR_BAD_REQUEST"){
        console.log("Algo salio mal")
      }
    },
  });

  const confirmDeleteArtist = (id: number) => {
    mutate(id);
    setBorrar(false)
  }

  return (
    <div className="flex w-full gap-16">
      <div className="flex flex-wrap w-full lg:max-w-[800px] gap-4">
        {artists?.map((artist) => (
          <Dialog key={artist.id}>
          <DialogTrigger className="rounded-lg p-2 flex flex-col items-center" onClick={()=> {setEdit(false); setBorrar(false)}}>
            <CardArtist artist={artist}/>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Artista</DialogTitle>
              <DialogDescription>Info</DialogDescription>
            </DialogHeader>
            {!edit ?
              <div className="flex flex-col gap-2">
                <h3 className="text-myprim-600 font-bold text-2xl border-b-[1px] border-gray-600">{artist.name}</h3>
                <p className="text-gray-700 font-semibold text-sm">Biografia</p>
                <p className="text-gray-500 font-semibold text-sm">{artist.bio}</p>
                <a href={artist.website} className="text-mysec-500 font-bold text-sm" >Web</a>
                {(state.user?.user__id === artist.owner && !borrar) && <div className="flex gap-2">
                  <button className="bg-mywarn-500 py-1 px-3 text-mywarn-100 rounded-lg hover:scale-105 transition" onClick={() => setEdit(true)}>Editar</button>
                  <button className="bg-myerror-500 py-1 px-3 text-myerror-100 rounded-lg hover:scale-105 transition" onClick={() => setBorrar(true)}>Borrar</button>
                </div>}
              </div>
            :<ArtistEdit artist={artist} />}
            {borrar && <div className="flex flex-col gap-2 items-center">
              <p>Seguro quieres eliminar el artista permanentemente?</p>
              {!loading ? <button 
              onClick={() => {confirmDeleteArtist(artist.id)}}
              className="px-6 py-1 bg-myerror-100 text-myerror-400 rounded-lg hover:scale-105 transition active:scale-95">Si</button>:
              <p>Borrando</p>}
              </div>}

          </DialogContent>
        </Dialog>
          
        ))}
      
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
