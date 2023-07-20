"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBucket = void 0;
class TokenBucket {
    constructor(capacity, refillRate) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.lastRefillTime = Date.now();
        this.refillRate = refillRate;
    }
    refill() {
        const now = Date.now();
        const timeElapsed = now - this.lastRefillTime;
        const newTokens = (timeElapsed / 1000) * this.refillRate;
        this.tokens = Math.min(this.tokens + newTokens, this.capacity);
        this.lastRefillTime = now;
    }
    isAllowed() {
        this.refill();
        if (this.tokens >= 1) {
            return true;
        }
        return false;
    }
    consumeToken() {
        this.refill();
        if (this.tokens >= 1) {
            this.tokens--;
            return true;
        }
        return false;
    }
}
exports.TokenBucket = TokenBucket;
