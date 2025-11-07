import { format, parseISO } from "date-fns";
import { GetStaticPaths, GetStaticProps } from "next";
import { ptBR } from 'date-fns/locale/pt-BR';
import Image from "next/image";
import Head from "next/head";
import Link from 'next/link';

import { convertDurationToString } from "../../utils/convertDurationToString";
import { getEpisodeFromSource, listEpisodesFromSource } from "../../services/episodeSource";
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
        <div className="min-h-full bg-gradient-to-b from-[#f8fafc] via-[#f3f5ff] to-[#f9f9ff]">
            <div className="mx-auto w-full max-w-4xl px-5 py-10 md:px-8">
            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>

            <div className="relative overflow-hidden rounded-[1.75rem] border border-gray-100 bg-white shadow-panel">
                <Link
                    href="/"
                    className="absolute left-4 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl bg-purple-500 text-white shadow-lg transition hover:-translate-y-1/2 hover:bg-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-200"
                    aria-label="Voltar para a home"
                >
                    <Image src="/arrow-left.svg" alt="Voltar" width={30} height={30} />
                </Link>

                <Image
                    src={episode.thumbnail}
                    alt={episode.title}
                    width={1200}
                    height={600}
                    objectFit="cover"
                    className="h-80 w-full rounded-[1.75rem] object-cover sm:h-[26rem]"
                />

                <button
                    type="button"
                    onClick={() => play(episode)}
                    className="absolute right-4 top-1/2 z-10 inline-flex h-16 w-16 -translate-y-1/2 items-center justify-center rounded-2xl bg-green-500 text-white shadow-lg transition hover:-translate-y-1/2 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                    <Image src="/play.svg" alt="Tocar episodio" width={32} height={32} />
                </button>
            </div>

            <header className="mt-10 border-b border-gray-100 pb-6">
                <h1 className="font-display text-3xl text-gray-900">{episode.title}</h1>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-medium text-gray-500">
                    <span className="rounded-full border border-gray-200 px-4 py-1 text-gray-600">
                        {episode.members}
                    </span>
                    <span className="rounded-full border border-gray-200 px-4 py-1 text-gray-600">
                        {episode.publishedAt}
                    </span>
                    <span className="rounded-full border border-gray-200 px-4 py-1 text-gray-600">
                        {episode.durationAsString}
                    </span>
                </div>
            </header>

            <div
                className="mt-8 rounded-3xl border border-white/60 bg-white/70 p-6 text-base leading-relaxed text-gray-700 shadow-sm backdrop-blur [&>p]:my-6 [&>p]:text-gray-700 [&>strong]:text-gray-900 [&>ul]:ml-6 [&>ul]:list-disc"
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />
            </div>
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const episodes = await listEpisodesFromSource({ limit: 2 });

    return {
        paths: episodes.map(episode => ({
            params: {
                slug: episode.id,
            }
        })),
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params ?? {};

    if (!slug || typeof slug !== 'string') {
        return {
            notFound: true,
        }
    }

    const data = await getEpisodeFromSource(slug);

    if (!data) {
        return {
            notFound: true,
        }
    }

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
