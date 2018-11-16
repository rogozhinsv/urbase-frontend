import { DictionaryItem } from "./dictionare-item";


export interface OkvedsResult {
    next: string;
    prev: string;
    count: number;
    results: DictionaryItem[];
}