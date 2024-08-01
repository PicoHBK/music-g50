import apiHarmSongPrivate from '@/apis/privateHarmonySong';
import { PlayListType } from '@/types/harmony'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChangeEvent, FormEvent, useState } from 'react';
interface FormData {
    id: number
    name: string;
    description: string | null;
    public: boolean;
  }
  
  const putPlayList = (formData: FormData) => {
    const token = localStorage.getItem("token");
    return apiHarmSongPrivate
      .put<PlayListType>(`/harmonyhub/playlists/${formData.id}`, formData, {
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

function PlayListEdit({playlist}:{playlist:PlayListType}) {
    const [formData, setFormData] = useState<FormData>({
        id:playlist.id,
        name: playlist.name,
        description: playlist.description,
        public: playlist.public,
      });
    
      const [loading, setLoading] = useState(false);
      const [message, setMessage] = useState("");
      const queryClient = useQueryClient();
    
      const { mutate, isSuccess } = useMutation({
        mutationFn: putPlayList,
        onMutate: () => {
          console.log("Mandando la playlist");
        },
        onSuccess: (data) => {
          console.log("ON SUCCESS Play List");
          console.log(JSON.stringify(data));
          queryClient.invalidateQueries({ queryKey: ["playlists-infiity"] });
          if (data.code === "ERR_BAD_REQUEST") {
            setMessage("Algo salio mal");
          }
          setLoading(false);
        },
      });
    
      const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, type, value } = e.target;
        let newValue: string | boolean = value;
      
        if (type === 'checkbox') {
          newValue = (e.target as HTMLInputElement).checked;
        }
      
        setFormData({ ...formData, [name]: newValue });
        
        setMessage("");
      };
    
      const submitForm = (e: FormEvent): void => {
        e.preventDefault();
        console.log(formData);
        setLoading(true);
        mutate(formData);
      };
    
      return <>
      {!isSuccess ? (
        <form
          onSubmit={submitForm}
          className="flex flex-col font-lato gap-3 items-start text-mydark-100"
          encType="multipart/form-data"
        >
          <input
            name="name"
            type="text"
            maxLength={50}
            value={formData.name}
            placeholder="Nombre"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          />
          <textarea
            name="description"
            rows={4}
            cols={50}
            value={formData.description || ""}
            placeholder="Biografía"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          />
    
        <label>
            PlayList Publica
        </label>
          <input
            name="public"
            type="checkbox"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          />
    
          {!loading ? (
            <button
              type="submit"
              className="inline bg-myprim-600 text-myprim-200 py-2 px-6 font-bold rounded-sd transition-colors duration-300 hover:bg-mysec-400 focus:outline-none active:bg-mysec-700 active:duration-2000"
            >
              Editar PlayList
            </button>
          ) : (
            <div className="w-10 h-10">
              <img
                src="https://img.icons8.com/?size=100&id=ldCN5cWRfXQ5&format=png&color=000000"
                alt="loading"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {message && (
            <p className="text-md text-myerror-500 font-bold">{message}</p>
          )}
        </form>
      ) : (
        <p className="text-mysuccess-400 bg-mysuccess-50 p-2 rounded-lg text-center font-semibold text-lg">PlayList editada con éxito</p>
      )}
    </>;
}

export default PlayListEdit