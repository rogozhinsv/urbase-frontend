import { Company } from "./company";

export interface CompaniesResult {
    count: number;
    next: string;
    results: Company[];
    regions: any[];
    okveds: any[];
}