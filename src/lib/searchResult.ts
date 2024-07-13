import { writable } from "svelte/store";
import type { SearchResult } from "./models";


export const enum SearchResultType {
    ALBUMS = 'Albums',
    TRACKS = 'Tracks',
}

export const searchResultStore = writable<SearchResult|undefined>(undefined);
export const searchResultTypeStore = writable<SearchResultType>(SearchResultType.ALBUMS);
