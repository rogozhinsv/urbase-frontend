import { Company } from "./company";
import { DictionaryItem } from "./dictionare-item";

export interface CompaniesResult {
    count: number;
    next: string;
    results: Company[];
    regions: number[];
    okveds: number[];
}