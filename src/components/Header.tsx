import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../hooks/useAuth";
import apiUserPrivate from "../apis/privateUser";
import { UserType } from "../types/User";
import { useEffect } from "react";

const fetchUserData = async () => {
  const token = localStorage.getItem("token");
  const { data } = await apiUserPrivate.get<UserType>(
    `users/profiles/profile_data/`,
    {
      headers: {
        Authorization: `Token ${token}`, // Incluir el token en los encabezados
      },
    }
  );
  return data;
};

function Header() {
  const {
    data: user,
    isSuccess,
    isError,
  } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
    staleTime: Infinity,
  });
  const { dispatch } = useAuthContext();

  useEffect(() => {
    if (isSuccess) {
      dispatch({ type: "SET_AUTH", payload: true });
    }
    if (isError) {
      dispatch({ type: "SET_AUTH", payload: false });
      localStorage.removeItem("token");
    }
  }, [isSuccess, isError, dispatch]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("onSubmit")
  };
  return (
    <header className="flex justify-between w-full bg-myprim-200 px-4 font-lato items-center">
      <form onSubmit={onSubmit} className=" text-myprim-600 w-full text-sm">
        <input
          name="search"
          type="text"
          maxLength={25}
          placeholder="Buscador"
          className="border-myprim-200 border-[1px] px-3 py-2 rounded-sm font-semibold focus:outline-none w-full max-w-96"
        />
      </form>
      <section className="flex w-full items-center gap-2 p-2 justify-end">
        <div className="h-16 w-16">
          <img
            src="https://img.icons8.com/?size=100&id=Lr0C4Mif8SOP&format=png&color=000000"
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
            <p>Invitado</p>
          )}
        </div>
      </section>
    </header>
  );
}

export default Header;
