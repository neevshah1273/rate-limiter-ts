"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenBucket = exports.RefillRateTimeUnit = void 0;
const ioredis_1 = require("ioredis");
const storageOption_1 = require("./storageOption");
var RefillRateTimeUnit;
(function (RefillRateTimeUnit) {
    RefillRateTimeUnit["Year"] = "year";
    RefillRateTimeUnit["Month"] = "month";
    RefillRateTimeUnit["Day"] = "day";
    RefillRateTimeUnit["Hour"] = "hour";
    RefillRateTimeUnit["Minute"] = "minute";
    RefillRateTimeUnit["Second"] = "second";
})(RefillRateTimeUnit || (exports.RefillRateTimeUnit = RefillRateTimeUnit = {}));
class TokenBucket {
    constructor(capacity, refillRate, refillRateUnit, storageOption, burstPeriod, redisOptions) {
        if (capacity < 1) {
            throw new Error('Capacity must be greater than or equal to 1.');
        }
        if (refillRate < 0) {
            throw new Error('Refill rate must be greater than or equal to 0.');
        }
        this.capacity = capacity;
        this.tokens = new Map();
        this.lastRefillTime = new Map();
        this.refillRate = refillRate;
        this.refillRateUnit = refillRateUnit;
        this.burstPeriod = burstPeriod;
        this.storageOption = storageOption;
        if (this.storageOption == storageOption_1.StorageOption.Redis) {
            try {
                this.redisClient = new ioredis_1.default(redisOptions);
            }
            catch (error) {
                throw new Error(error.message);
            }
        }
    }
    getRefillRateInSeconds() {
        switch (this.refillRateUnit) {
            case RefillRateTimeUnit.Year:
                return this.refillRate * 365 * 24 * 60 * 60;
            case RefillRateTimeUnit.Month:
                return this.refillRate * 30 * 24 * 60 * 60;
            case RefillRateTimeUnit.Day:
                return this.refillRate * 24 * 60 * 60;
            case RefillRateTimeUnit.Hour:
                return this.refillRate * 60 * 60;
            case RefillRateTimeUnit.Minute:
                return this.refillRate * 60;
            case RefillRateTimeUnit.Second:
                return this.refillRate;
            default:
                throw new Error('Invalid refill rate unit.');
        }
    }
    refill(key) {
        const now = Date.now();
        if (!this.tokens.has(key)) {
            this.tokens.set(key, this.capacity);
            this.lastRefillTime.set(key, now);
            return;
        }
        const timeElapsed = now - this.lastRefillTime.get(key);
        const newTokens = (timeElapsed / 1000) * this.getRefillRateInSeconds();
        this.tokens.set(key, Math.min(this.tokens.get(key) + newTokens, this.capacity));
        this.lastRefillTime.set(key, now);
    }
    isAllowed(key) {
        if (!key)
            key = 'global';
        this.refill(key);
        if (this.tokens.get(key) >= 1) {
            return true;
        }
        return false;
    }
    consumeToken(key) {
        if (!key)
            key = 'global';
        this.refill(key);
        if (this.tokens.get(key) >= 1) {
            this.tokens.set(key, this.tokens.get(key) - 1);
            return true;
        }
        return false;
    }
}
exports.TokenBucket = TokenBucket;
