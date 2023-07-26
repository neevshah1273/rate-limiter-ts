import { RedisOptions } from 'ioredis';
import { StorageOption } from "./storageOption";
export declare enum RefillRateTimeUnit {
    Year = "year",
    Month = "month",
    Day = "day",
    Hour = "hour",
    Minute = "minute",
    Second = "second"
}
export declare class TokenBucket {
    private capacity;
    private tokens;
    private lastRefillTime;
    private refillRate;
    private refillRateUnit;
    private burstPeriod;
    private storageOption;
    private redisClient?;
    constructor(capacity: number, refillRate: number, refillRateUnit: RefillRateTimeUnit, storageOption: StorageOption, burstPeriod?: number, redisOptions?: RedisOptions);
    private getRefillRateInSeconds;
    private refill;
    isAllowed(key?: string): boolean;
    consumeToken(key?: string): boolean;
}
