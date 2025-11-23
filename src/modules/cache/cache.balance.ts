import type { CacheUserBalance, CachedUserBalance } from "./cache.type.js";

const cacheBalance = new Map<string, CachedUserBalance>();
let insertCount = 0;

export const setCacheUserBalance = (data: CacheUserBalance) => {
    const { userId, balance } = data;
    insertCount++;
    
    if (insertCount > 1000) {
        cacheBalance.clear();
        insertCount = 0;
    }

    cacheBalance.set(userId, { balance: balance });
};


export const getCacheUserBalance = (userId: string) => {
    const result = cacheBalance.get(userId);
    if (!result) {
        return;
    }
    const convertedBalance = { balance: BigInt(result.balance) };

    return convertedBalance;
};
