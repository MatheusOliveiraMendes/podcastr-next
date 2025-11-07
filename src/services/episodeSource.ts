import path from 'path';
import { promises as fs } from 'fs';
import { api } from './api';

type EpisodeFile = {
  id: string;
  title: string;
  members: string;
  published_at: string;
  thumbnail: string;
  description: string;
  file: {
    url: string;
    type: string;
    duration: number;
  };
};

type EpisodesFile = {
  episodes: EpisodeFile[];
};

type ListEpisodesOptions = {
  limit?: number;
  sortField?: keyof EpisodeFile;
  sortOrder?: 'asc' | 'desc';
};

const DEFAULT_LIMIT = 12;

export async function listEpisodesFromSource(
  options: ListEpisodesOptions = {}
): Promise<EpisodeFile[]> {
  const {
    limit = DEFAULT_LIMIT,
    sortField = 'published_at',
    sortOrder = 'desc',
  } = options;

  try {
    const { data } = await api.get<EpisodeFile[]>('episodes', {
      params: {
        _limit: limit,
        _sort: sortField,
        _order: sortOrder,
      },
    });

    return data;
  } catch {
    const episodes = await readEpisodesFromFile();

    const sorted = [...episodes].sort((a, b) => {
      const left = a[sortField];
      const right = b[sortField];

      if (typeof left === 'number' && typeof right === 'number') {
        return sortOrder === 'desc' ? right - left : left - right;
      }

      const leftDate = new Date(String(left)).getTime();
      const rightDate = new Date(String(right)).getTime();

      return sortOrder === 'desc'
        ? rightDate - leftDate
        : leftDate - rightDate;
    });

    return sorted.slice(0, limit);
  }
}

export async function getEpisodeFromSource(id: string): Promise<EpisodeFile | null> {
  try {
    const { data } = await api.get<EpisodeFile>(`episodes/${id}`);
    return data;
  } catch {
    const episodes = await readEpisodesFromFile();
    return episodes.find((episode) => episode.id === id) ?? null;
  }
}

async function readEpisodesFromFile(): Promise<EpisodeFile[]> {
  const filePath = path.join(process.cwd(), 'server.json');
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const parsed: EpisodesFile = JSON.parse(fileContent);
  return parsed.episodes ?? [];
}

export type { EpisodeFile };
