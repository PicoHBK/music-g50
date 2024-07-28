import apiHarmSongPrivate from "@/apis/privateHarmonySong";
import { useAuthContext } from "@/hooks/useAuth";
import { ArtistType } from "@/types/harmony";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";

interface FormData {
    id: number | null;
    name: string;
    bio?: string;
    website?: string;
    image?: File | null;
  }
  
  const postArtist = (formData: FormData) => {
    const token = localStorage.getItem("token");
    const data = new FormData();
  
    data.append("name", formData.name);
    formData.bio && data.append("bio", formData.bio);
    formData.website && data.append("website", formData.website);
    if (formData.image) {
      data.append("image", formData.image);
    }
  
    return apiHarmSongPrivate
      .put<ArtistType>(`/harmonyhub/artists/${formData.id}`, data, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        return error;
      });
  };
function ArtistEdit({artist}: {artist: ArtistType}) {
    const [formData, setFormData] = useState<FormData>({
        id: artist.id,
        name: artist.name,
        bio: artist.bio || "",
        website: artist.website|| "",
        image: null,
      });
    
      const [loading, setLoading] = useState(false);
      const [message, setMessage] = useState("");
      const queryClient = useQueryClient();

      const {state} = useAuthContext()
    
      const { mutate, isSuccess } = useMutation({
        mutationFn: postArtist,
        onMutate: () => {
          console.log("Mandando la song");
        },
        onSuccess: (data) => {
          console.log("ON SUCCESS Artists");
          console.log(JSON.stringify(data));
          queryClient.invalidateQueries({ queryKey: ["artists"] });
          if (data.code === "ERR_BAD_REQUEST") {
            setMessage("Algo salio mal");
          }
          setLoading(false);
        },
      });
    
      const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
      
        if (type === "file") {
          const target = e.target as HTMLInputElement;
          if (target.files) {
            setFormData({ ...formData, [name]: target.files[0] });
          }
        } else {
          setFormData({ ...formData, [name]: value });
        }
      
        setMessage("");
      };
      
    
      const submitForm = (e: FormEvent): void => {
        e.preventDefault();
        console.log(formData);
        setLoading(true);
        mutate(formData);
      };
  return (
    <>
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
            disabled={(loading || state.user?.user__id !== artist.owner)}
          />
          <textarea
            name="bio"
            rows={4}
            cols={50}
            value={formData.bio}
            placeholder="Biografía"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={(loading || state.user?.user__id !== artist.owner)}
          />
          <input
            name="website"
            type="url"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            value={formData.website}
            placeholder="Web"
            onChange={handleChange}
            disabled={(loading || state.user?.user__id !== artist.owner)}
          />

          {state.user?.user__id === artist.owner && <input
            name="image"
            type="file"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={(loading)}
          />}

          {!loading ? (
            <button
              type="submit"
              className="inline bg-myprim-600 text-myprim-200 py-2 px-6 font-bold rounded-sd transition-colors duration-300 hover:bg-mysec-400 focus:outline-none active:bg-mysec-700 active:duration-2000"
            >
              Editar
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
        <p>Cargado</p>
      )}
    </>
  )
}

export default ArtistEdit