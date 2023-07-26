"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
// Import the rate limiting algorithms from their respective files
const storageOption_1 = require("./storageOption");
const tokenBucket_1 = require("./tokenBucket");
// Export the user-facing API class
class RateLimiter {
    // | LeakyBucket | RequestCount;
    constructor(algorithmName, capacity, refillRate) {
        switch (algorithmName) {
            case 'token-bucket':
                this.algorithm = new tokenBucket_1.TokenBucket(capacity, refillRate, tokenBucket_1.RefillRateTimeUnit.Second, storageOption_1.StorageOption.Normal);
                break;
                // case 'leaky-bucket':
                //   this.algorithm = new LeakyBucket();
                //   break;
                // case 'request-count':
                //   this.algorithm = new RequestCount();
                break;
            default:
                throw new Error('Invalid rate limiting algorithm selected.');
        }
    }
    // User-facing methods to interact with the chosen algorithm
    consumeToken() {
        return this.algorithm.consumeToken();
    }
    isAllowed() {
        return this.algorithm.isAllowed();
    }
}
exports.RateLimiter = RateLimiter;
