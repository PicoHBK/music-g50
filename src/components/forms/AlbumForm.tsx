import apiHarmSongPrivate from "@/apis/privateHarmonySong";
import { useArtists } from "@/hooks/useArtists";
import { useAuthContext } from "@/hooks/useAuth";
import { AlbumType } from "@/types/harmony";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, FormEvent, useState } from "react";

interface FormData {
    title: string;
    year: number | null;
    artist: number | null;
    cover: File | null;
  }

  const postAlbum = (formData: FormData) => {
    const token = localStorage.getItem("token");
    const data = new FormData();
  
    data.append("title", formData.title);
    formData.year && data.append("year", formData.year.toString());
    formData.artist && data.append("artist", formData.artist.toString());
    if (formData.cover) {
      data.append("cover", formData.cover);
    }
  
    return apiHarmSongPrivate
      .post<AlbumType>("/harmonyhub/albums/", data, {
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
function AlbumForm() {

    const [formData, setFormData] = useState<FormData>({
        title: "",
        year:  null,
        artist: null,
        cover: null,
      });
      const [loading, setLoading] = useState(false);
      const [message, setMessage] = useState("");
      const queryClient = useQueryClient();
      const { state } = useAuthContext();
    
      const { mutate, isSuccess } = useMutation({
        mutationFn: postAlbum,
        onMutate: () => {
          console.log("Mandando el album");
        },
        onSuccess: (data) => {
          console.log("ON SUCCESS SONG");
          console.log(JSON.stringify(data));
          queryClient.invalidateQueries({ queryKey: ["albums"] });
          if (data.code === "ERR_BAD_REQUEST") {
            setMessage("Algo salio mal");
          }
          setLoading(false);
        },
      });

      const {data:artists} = useArtists()
    
    
      const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => {
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
          className="flex flex-col font-lato gap-3 items-center text-mydark-100"
          encType="multipart/form-data"
        >
          
          <input
            name="title"
            type="text"
            value={formData.title}
            maxLength={50}
            placeholder="Título"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          />

          
          <input
            name="year"
            type="number"
            max={2147483647}
            placeholder="Año"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          />

          <label
            htmlFor="artist"
            className="block font-semibold mb-1 text-sm text-myprim-600"
          >
            Ártista
          </label>
          <select
            id="artist"
            name="artist"
            className="px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          >
            {artists
              ?.filter((artist) => artist.owner === state.user?.user__id)
              .map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name}
                </option>
              ))}
          </select>

          <label
            htmlFor="cover"
            className="block font-semibold mb-1 text-sm text-myprim-600"
          >
            Cover
          </label>
          <input
            id="cover"
            name="cover"
            type="file"
            className="border-myneutral-400 border-[1px] px-3 py-2 rounded-sm font-semibold"
            onChange={handleChange}
            disabled={loading}
          />

          {!loading ? (
            <button
              type="submit"
              className="inline bg-mywarn-500 text-mywarn-100 py-2 px-6 font-bold rounded-sd transition-colors duration-300 hover:bg-mysec-400 focus:outline-none active:bg-mysec-700 active:duration-2000"
            >
              Crear Album
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

export default AlbumForm