import { DictionaryItem } from "./dictionare-item";


export interface RegionsResult {
    next: string;
    prev: string;
    count: number;
    results: DictionaryItem[];
}