export declare class TokenBucket {
    private capacity;
    private tokens;
    private lastRefillTime;
    private refillRate;
    constructor(capacity: number, refillRate: number);
    private refill;
    isAllowed(): boolean;
    consumeToken(): boolean;
}
