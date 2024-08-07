import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../hooks/useAuth";
import apiUserPrivate from "../apis/privateUser";
import { UserType } from "../types/User";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import apiHarmSongPrivate from "@/apis/privateHarmonySong";
import { AuthAction } from "@/reducer/AuthReducer";

// Función para obtener los datos del usuario y manejar el estado
const fetchUserData = async (
  dispatch: React.Dispatch<AuthAction>
): Promise<UserType> => {
  const token = localStorage.getItem("token");
  try {
    const { data } = await apiUserPrivate.get<UserType>(
      `users/profiles/profile_data/`,
      {
        headers: {
          Authorization: `Token ${token}`, // Token
        },
      }
    );
    dispatch({ type: "SET_AUTH", payload: true });
    dispatch({ type: "SET_USER", payload: data });
    return data;
  } catch (error) {
    dispatch({ type: "SET_AUTH", payload: false });
    localStorage.removeItem("token");
    throw error; // Re-lanzar el error para que `useQuery` lo maneje
  }
};

// Función para hacer logout
const logout = async () => {
  const token = localStorage.getItem("token");
  const { data } = await apiHarmSongPrivate.post(
    "/users/profiles/logout/",
    {}, //
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return data;
};

// Componente Header
function Header() {
  const { dispatch, state } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["userData"],
    queryFn: () => fetchUserData(dispatch), // Pasar dispatch a la función
    staleTime: Infinity,
    retry: 2,
    enabled: !!localStorage.getItem("token"),
  });

  const { mutate } = useMutation({
    mutationFn: logout,
    onMutate: () => {
      console.log("logout ...");
      dispatch({ type: "SET_AUTH", payload: false });
      dispatch({ type: "SET_USER", payload: undefined });
      setLoading(true);
    },
    onSuccess: (data) => {
      console.log("Logout exitoso");
      console.log(JSON.stringify(data));
      //queryClient.invalidateQueries({ queryKey: ["userData"] });
      if (data.code === "ERR_BAD_REQUEST") {
        console.log("Algo salió mal");
      }
      setLoading(false);
      localStorage.removeItem("token");
    },
    onError: (error) => {
      console.error("Error durante el logout:", error);
      setLoading(false);
    },
  });

  // Manejo de efectos secundarios movidos a fetchUserData
  const onSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("onSubmit");
  };

  const handleLogout = () => {
    mutate();
  };

  return (
    <header className="flex justify-between w-full px-4 font-lato items-center min-h-20">
      <form
        onSubmit={onSubmitSearch}
        className="text-myprim-600 w-full text-sm"
      >
        <input
          name="search"
          type="text"
          maxLength={25}
          placeholder="Buscador"
          className="border-myprim-200 border-[1px] px-3 py-2 rounded-sm font-semibold focus:outline-none w-full max-w-96"
        />
      </form>
      {state.auth && (
        <Dialog>
          <DialogTrigger className="flex w-full items-center gap-2 p-2 justify-end">
            <div className="h-16 w-16">
              <img
                src={`https://sandbox.academiadevelopers.com${user?.image}`||"https://img.icons8.com/?size=100&id=Lr0C4Mif8SOP&format=png&color=000000"}
                alt="avatar"
                className="w-full h-full object-contain rounded-full border-2 border-myprim-600"
              />
            </div>
            <div className="max-w-32">
              {user?.first_name ? (
                <p className="font-bold text-myprim-800 text-sm">
                  {user.first_name} {user.last_name}
                </p>
              ) : (
                <p>Bienvenido</p>
              )}
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-myprim-600">Perfil</DialogTitle>
              <DialogDescription>Saludos !!!</DialogDescription>
              <section className="flex w-full items-center">
                <div className="flex flex-col w-full gap-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {user?.username}
                  </h3>
                  <h5 className="text-sm text-gray-600 font-semibold">
                    {user?.email}
                  </h5>
                  <h5 className="text-sm text-gray-600">
                    {user?.first_name + " " + user?.last_name}
                  </h5>
                  
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={`https://sandbox.academiadevelopers.com${user?.image}`}
                    alt="perfil-img"
                    className="w-full h-full object-cover"
                  />
                </div>
              </section>
              <section className="flex gap-2 mt-2">
                    <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                      Editar
                    </button>
                    <button
                      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                      onClick={handleLogout}
                      disabled={loading}
                    >
                      {loading ? "Cerrando sesión..." : "Logout"}
                    </button>
                  </section>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </header>
  );
}

export default Header;
