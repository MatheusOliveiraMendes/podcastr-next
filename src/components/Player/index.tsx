import styles from "./styles.module.scss";
import Image from "next/image";
import { useContext, useEffect, useRef } from "react";
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

import { PlayerContext } from "../../contexts/PlayerContext";

export function Player() {
    const autoRef = useRef<HTMLAudioElement>(null);

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        togglePlay,
        setPlayingState
    } = useContext(PlayerContext)

    useEffect(() => {
        if (!autoRef.current) {
            return;
        }
        if (isPlaying) {
            autoRef.current.play();
        } else {
            autoRef.current.pause();
        }
    }, [isPlaying])

    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className={styles.playerContainer}>
            <header>
                <Image
                    src="/playing.svg"
                    alt="Tocando agora"
                    width={50}
                    height={50}
                />
                <strong>Tocando agora</strong>
            </header>

            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>00:00</span>
                </div>

                {episode && (
                    <audio
                        src={episode.url}
                        ref={autoRef}
                        autoPlay
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                    />
                )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <Image src="/shuffle.svg" alt="Embaralhar" width={30} height={30} />
                    </button>
                    <button type="button" disabled={!episode}>
                        <Image src="/play-previous.svg" alt="Tocar anterior" width={30} height={30} />
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        {isPlaying
                            ? <Image src="/pause.svg" alt="Tocar" width={30} height={30} />
                            : <Image src="/play.svg" alt="Tocar" width={30} height={30} />
                        }
                    </button>
                    <button type="button" disabled={!episode}>
                        <Image src="/play-next.svg" alt="Tocar proxima" width={30} height={30} />
                    </button>
                    <button type="button" disabled={!episode}>
                        <Image src="/repeat.svg" alt="Repetir" width={30} height={30} />
                    </button>
                </div>
            </footer>

        </div>
    );
}