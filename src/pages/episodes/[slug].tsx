import { format, parseISO } from "date-fns";
import { GetStaticPaths, GetStaticProps } from "next";
import { ptBR } from 'date-fns/locale/pt-BR';
import Image from "next/image";
import Head from "next/head";
import Link from 'next/link';

import { api } from '../../services/api';
import { convertDurationToString } from "../../utils/convertDurationToString";

import styles from './episode.module.scss';
import { usePlayer } from "../../contexts/PlayerContext";

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    description: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {

    const { play } = usePlayer();

    return (
        <div className={styles.episode}>

            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>

            <div className={styles.thumbnailContainer}>
                <Link href="/" passHref>
                    <button type="button">
                        <Image src="/arrow-left.svg" alt="Voltar" width={30} height={30} />
                    </button>
                </Link>

                <Image src={episode.thumbnail} alt={episode.title} width={700} height={160} objectFit="cover" />

                <button type="button" onClick={() => play(episode)}>
                    <Image src="/play.svg" alt="Tocar episodio" width={50} height={50} />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />



        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;

    const { data } = await api.get(`/episodes/${slug}`)


    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    };


    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24, // 24 hours
    }
}