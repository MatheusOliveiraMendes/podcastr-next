import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Slider from "rc-slider";

import "rc-slider/assets/index.css";

import { usePlayer } from "../../contexts/PlayerContext";
import { convertDurationToString } from "../../utils/convertDurationToString";

const cx = (...classes: Array<string | false | null | undefined>) =>
    (classes.filter(Boolean) as string[]).join(" ");

export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        clearPlayerState,
    } = usePlayer();

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    function setupProgressListener() {
        if (!audioRef.current) {
            return;
        }

        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            if (!audioRef.current) {
                return;
            }

            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek (value: number | number[]) {
        const amount = Array.isArray(value) ? value[0] : value;
        if (!audioRef.current) {
            return;
        }

        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if (hasNext){
            playNext()
        } else {
            clearPlayerState()
        }
    }

    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className="flex w-full flex-col items-center justify-between bg-gradient-to-b from-purple-500 via-[#5a37c0] to-[#3b1f6e] px-6 py-8 text-white shadow-[0_-12px_32px_rgba(13,0,35,0.18)] lg:sticky lg:top-0 lg:h-screen lg:max-w-[26.5rem] lg:shadow-[-12px_0_32px_rgba(13,0,35,0.28)] xl:px-10 xl:py-12">
            <header className="flex w-full items-center gap-3">
                <Image
                    src="/playing.svg"
                    alt="Tocando agora"
                    width={50}
                    height={50}
                />
                <strong className="font-display text-base">Tocando agora</strong>
            </header>

            {episode ? (
                <div className="mt-10 flex w-full flex-col items-center text-center">
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                        className="rounded-3xl"
                    />
                    <strong className="mt-8 font-display text-xl leading-tight">{episode.title}</strong>
                    <span className="mt-3 text-sm text-white/80">{episode.members}</span>
                </div>
            ) : (
                <div className="mt-10 flex w-full flex-col items-center gap-6 rounded-3xl border border-white/15 bg-white/5 p-8 text-center backdrop-blur">
                    <div className="flex h-32 w-32 items-center justify-center rounded-2xl border border-white/15 bg-white/5 shadow-inner shadow-black/30">
                        <Image
                            src="/logo.svg"
                            alt="Capa do Podcastr"
                            width={120}
                            height={120}
                            objectFit="contain"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <strong className="text-lg">Selecione um podcast para ouvir</strong>
                        <p className="text-sm text-white/70">
                            Escolha um episódio e deixe que a gente cuide da trilha sonora do seu dia.
                        </p>
                    </div>
                </div>
            )}

            <footer className="mt-8 w-full">
                <div className={cx("flex items-center gap-4 text-sm", !episode && "opacity-50")}>
                    <span className="inline-block w-16 text-center text-xs font-semibold tracking-wide text-white/80">
                        {convertDurationToString(progress)}
                    </span>
                    <div className="flex-1">
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className="h-1 w-full rounded bg-purple-300/60" />
                        )}
                    </div>
                    <span className="inline-block w-16 text-center text-xs font-semibold tracking-wide text-white/80">
                        {convertDurationToString(episode?.duration ?? 0)}
                    </span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        loop={isLooping}
                        autoPlay
                        onEnded={handleEpisodeEnded}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />
                )}

                <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                        type="button"
                        disabled={!episode || episodeList.length === 1}
                        onClick={toggleShuffle}
                        className={cx(
                            "flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/5 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40",
                            isShuffling && "border-green-500/70 bg-white/20"
                        )}
                    >
                        <Image src="/shuffle.svg" alt="Embaralhar" width={30} height={30} />
                    </button>
                    <button
                        type="button"
                        onClick={playPrevious}
                        disabled={!episode || !hasPrevious}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/5 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Image src="/play-previous.svg" alt="Tocar anterior" width={30} height={30} />
                    </button>
                    <button
                        type="button"
                        className="flex h-16 w-20 items-center justify-center rounded-2xl bg-purple-400 shadow-lg transition hover:bg-purple-300 disabled:cursor-not-allowed disabled:bg-white/10"
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        {isPlaying
                            ? <Image src="/pause.svg" alt="Tocar" width={30} height={30} />
                            : <Image src="/play.svg" alt="Tocar" width={30} height={30} />
                        }
                    </button>
                    <button
                        type="button"
                        onClick={playNext}
                        disabled={!episode || !hasNext}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/5 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Image src="/play-next.svg" alt="Tocar proxima" width={30} height={30} />
                    </button>
                    <button
                        type="button"
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={cx(
                            "flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/5 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40",
                            isLooping && "border-green-500/70 bg-white/20"
                        )}
                    >
                        <Image src="/repeat.svg" alt="Repetir" width={30} height={30} />
                    </button>
                </div>
            </footer>

        </div>
    );
}
