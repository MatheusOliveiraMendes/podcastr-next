import type { AppProps } from "next/app";
import { Header } from "../components/Header"
import { Player } from "../components/Player";

import "../styles/global.scss"

import { PlayerContextProvider } from "../contexts/PlayerContext";



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <PlayerContextProvider>
      <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-[minmax(0,1fr)_26.5rem]">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <Component {...pageProps} />
          </main>
        </div>
        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
