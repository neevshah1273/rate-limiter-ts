export declare class RateLimiter {
    private algorithm;
    constructor(algorithmName: 'token-bucket' | 'leaky-bucket' | 'request-count', capacity: number, refillRate: number);
    consumeToken(): boolean;
    isAllowed(): boolean;
}
