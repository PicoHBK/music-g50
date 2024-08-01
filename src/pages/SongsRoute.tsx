import SongForm from "@/components/forms/SongForm";
import Songs from "../sections/Songs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSongs } from "@/hooks/useSongs";

function SongsRoute() {
  const {data} = useSongs()
  return (
    <div className="flex w-full">
      {data && <Songs filters={{}}/>}
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
          <p className="text-myprim-800">Agregar Canción</p>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Canción</DialogTitle>
              <DialogDescription>
                Solo mp3
                
              </DialogDescription>
              <SongForm/>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}

export default SongsRoute;
