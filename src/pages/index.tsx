import { GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { ptBR } from 'date-fns/locale/pt-BR';
import Image from "next/image";
import Head from "next/head";
import { convertDurationToString } from '../utils/convertDurationToString';

import { usePlayer } from '../contexts/PlayerContext';
import { listEpisodesFromSource } from '../services/episodeSource';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();

  const episodeList = [...latestEpisodes, ...allEpisodes];
  const spotlightEpisode = latestEpisodes[0];
  const totalEpisodes = episodeList.length;

  return (
    <div className="min-h-full bg-gradient-to-b from-[#f8fafc] via-[#f3f5ff] to-[#f9f9ff]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-5 py-10 md:px-10 lg:px-16">
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className="relative grid gap-8 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_#9164FA,_#6F48C9)] px-6 py-10 text-white shadow-[0_25px_60px_rgba(41,14,74,0.35)] md:grid-cols-[minmax(0,1fr)_360px] lg:grid-cols-[minmax(0,1fr)_420px] lg:px-10 lg:py-12">
        <div className="relative z-10 flex flex-col gap-6">
          <span className="inline-flex w-fit items-center rounded-full border border-white/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
            Novidades toda semana
          </span>
          <h1 className="font-display text-3xl leading-tight text-white lg:text-4xl">
            Podcasts modernos para acompanhar o seu ritmo
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-white/80">
            Descubra conversas profundas, entrevistas e histórias que inspiram. Escolha um episódio e continue ouvindo sem perder o embalo.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#all-episodes"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-purple-500 shadow-lg transition hover:-translate-y-0.5"
            >
              Explorar episódios
            </a>
            {spotlightEpisode && (
              <button
                type="button"
                className="inline-flex items-center rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/20"
                onClick={() => playList(episodeList, 0)}
              >
                Ouvir destaque
              </button>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-6">
            <div className="flex min-w-[120px] flex-col">
              <strong className="text-3xl text-white">{totalEpisodes}</strong>
              <span className="text-sm text-white/80">Episódios no ar</span>
            </div>
            <div className="flex min-w-[120px] flex-col">
              <strong className="text-3xl text-white">{latestEpisodes.length}</strong>
              <span className="text-sm text-white/80">Novos nesta semana</span>
            </div>
            <div className="flex min-w-[120px] flex-col">
              <strong className="text-3xl text-white">24/7</strong>
              <span className="text-sm text-white/80">Tocando sem parar</span>
            </div>
          </div>
        </div>

        {spotlightEpisode && (
          <div className="relative z-10 flex flex-col gap-5 rounded-[1.75rem] border border-white/25 bg-white/10 p-6 backdrop-blur">
            <Image
              src={spotlightEpisode.thumbnail}
              alt={spotlightEpisode.title}
              width={320}
              height={320}
              objectFit="cover"
              className="w-full rounded-3xl"
            />

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                Episódio em destaque
              </span>
              <strong className="font-display text-xl leading-tight text-white">{spotlightEpisode.title}</strong>
              <p className="text-sm text-white/70">{spotlightEpisode.members}</p>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-purple-500 shadow-lg transition hover:-translate-y-0.5"
                onClick={() => playList(episodeList, 0)}
              >
                <Image src="/play.svg" alt="Tocar destaque" width={24} height={24} />
                Reproduzir agora
              </button>
            </div>
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.35),_transparent_45%)] opacity-70 mix-blend-screen"
          aria-hidden="true"
        />
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-purple-400">Fique em dia</p>
            <h2 className="font-display text-2xl text-gray-800">Últimos lançamentos</h2>
          </div>
          <span className="text-sm text-gray-500">Atualizado automaticamente a cada nova publicação</span>
        </div>

        <ul className="grid gap-6 md:grid-cols-2">
          {latestEpisodes.slice(0, 2).map((episode, index) => (
            <li
              key={episode.id}
              className="group flex min-h-[220px] flex-col gap-5 rounded-3xl border border-[#9ea4b433] bg-white/95 p-5 shadow-card transition hover:-translate-y-1 hover:shadow-xl sm:flex-row sm:items-stretch"
            >
              <div className="flex-shrink-0 rounded-3xl bg-gradient-to-br from-purple-400 to-green-500 p-1 sm:w-40">
                <Image
                  src={episode.thumbnail}
                  alt={episode.title}
                  width={192}
                  height={192}
                  objectFit="cover"
                  className="h-32 w-full rounded-[1.5rem] object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col gap-3">
                <Link
                  href={`/episodes/${episode.id}`}
                  className="font-display text-lg text-gray-800 transition group-hover:text-purple-500"
                >
                  {episode.title}
                </Link>
                <p className="text-sm text-gray-500">{episode.members}</p>
                <div className="flex flex-wrap items-center gap-x-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                  <span className="tracking-[0.15em] text-gray-500">{episode.publishedAt}</span>
                  <span>•</span>
                  <span className="tracking-[0.15em] text-gray-500">{episode.durationAsString}</span>
                </div>
                <div className="mt-auto flex justify-end">
                  <button
                    type="button"
                    onClick={() => playList(episodeList, index)}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-400 text-white shadow-lg transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-200"
                  >
                    <Image
                      src="/play-green.svg"
                      alt="Tocar episodio"
                      width={30}
                      height={30}
                    />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-6" id="all-episodes">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-purple-400">Catálogo completo</p>
            <h2 className="font-display text-2xl text-gray-800">Todos os episódios</h2>
          </div>
          <span className="text-sm text-gray-500">Filtre, descubra e continue de onde parou</span>
        </div>

        <div className="space-y-4 lg:hidden">
          {allEpisodes.map((episode, index) => (
            <article
              key={episode.id}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <Image
                  width={96}
                  height={96}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                  className="h-20 w-20 rounded-2xl"
                />
                <div className="flex-1">
                  <Link
                    href={`/episodes/${episode.id}`}
                    className="font-display text-lg text-gray-800"
                  >
                    {episode.title}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">{episode.members}</p>
                </div>
                <button
                  type="button"
                  onClick={() => playList(episodeList, index + latestEpisodes.length)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-500"
                >
                  <Image src="/play-green.svg" alt="Tocar episodio" width={30} height={30} />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                <span className="tracking-[0.15em] text-gray-500">{episode.publishedAt}</span>
                <span>•</span>
                <span className="tracking-[0.15em] text-gray-500">{episode.durationAsString}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="hidden overflow-x-auto rounded-[1.5rem] border border-[#9ea4b433] bg-white shadow-panel lg:block">
          <table className="w-full min-w-[640px] border-collapse">
            <thead className="bg-gradient-to-r from-[#f6f3ff] to-[#f1f7ff] text-left text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
              <tr>
                <th className="w-24 px-5 py-4"></th>
                <th className="px-5 py-4">Podcast</th>
                <th className="px-5 py-4">Integrantes</th>
                <th className="w-32 px-5 py-4">Data</th>
                <th className="w-32 px-5 py-4">Duração</th>
                <th className="w-20 px-5 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map((episode, index) => (
                <tr
                  key={episode.id}
                  className="border-t border-gray-100 text-sm text-gray-600 transition hover:bg-gray-50/80"
                >
                  <td className="px-5 py-4">
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                      className="h-16 w-16 rounded-2xl"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/episodes/${episode.id}`}
                      className="font-display text-base text-gray-800 transition hover:text-purple-500"
                    >
                      {episode.title}
                    </Link>
                  </td>
                  <td className="px-5 py-4">{episode.members}</td>
                  <td className="px-5 py-4 font-medium text-gray-500">{episode.publishedAt}</td>
                  <td className="px-5 py-4 font-medium text-gray-500">{episode.durationAsString}</td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => playList(episodeList, index + latestEpisodes.length)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-500 transition hover:-translate-y-0.5"
                    >
                      <Image src="/play-green.svg" alt="Tocar episodio" width={30} height={30} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await listEpisodesFromSource({
    limit: 12,
    sortField: 'published_at',
    sortOrder: 'desc'
  });


  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToString(Number(episode.file.duration)),
      url: episode.file.url,
    };
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}
