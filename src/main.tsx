import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import queryClient from "./query/queryProvider.ts";
import { QueryClientProvider } from "@tanstack/react-query";
import { SongsProvider } from "./context/playerSong.tsx";
import { AuthProvider } from "./context/authContext.tsx";
import { PlaylistProvider } from "./context/playListContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <SongsProvider>
      <PlaylistProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PlaylistProvider>
    </SongsProvider>
  </QueryClientProvider>
);
