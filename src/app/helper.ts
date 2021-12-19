import { Bill, MoneyConstruct, Transaction } from './types';

export const compareId = (a: Bill, b: Bill) => +a.id < +b.id ? -1 : 1;
export const compareIdRev = (a: Bill, b: Bill) => compareId(b, a);
export const compareAmount = (a: MoneyConstruct, b: MoneyConstruct) => a.amount < b.amount ? -1 : 1;
export const compareAmountRev = (a: MoneyConstruct, b: MoneyConstruct) => compareAmount(b, a);
export const compareName = (a: Bill, b: Bill) => {
    if ( a.lastName < b.lastName ){
        return -1;
    };
    if ( a.lastName === b.lastName ){
        return a.firstName < b.firstName ? -1 : 1;
    }
};
export const compareNameRev = (a: Bill, b: Bill) => compareName(b, a);
export const comparePayer = (a: Transaction, b: Transaction) => a.payer < b.payer ? -1 : 1;
export const comparePayerRev = (a: Transaction, b: Transaction) => comparePayer(b, a);

/**
 * Returns a fitting comparison method.
 * @param type The type of data that is being compared.
 * @param descending True if descending ordering should be used.
 * @returns The comparison method.
 */
export const getComparisonMethod = (type: string, descending: boolean) => {
    if (type === 'rnr') {
        return descending ? compareIdRev : compareId;
    }
    if (type === 'amount') {
        return descending ? compareAmountRev : compareAmount;
    }
    if (type === 'name') {
        return descending ? compareNameRev : compareName;
    }
    if (type === 'amount') {
        return descending ? compareAmountRev : compareAmount;
    }
    if (type === 'payer') {
        return descending ? comparePayerRev : comparePayer;
    }
};
