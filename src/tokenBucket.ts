import Redis, { RedisOptions } from 'ioredis';
import { StorageOption } from "./storageOption";

export enum RefillRateTimeUnit {
  Year = 'year',
  Month = 'month',
  Day = 'day',
  Hour = 'hour',
  Minute = 'minute',
  Second = 'second',
}

export class TokenBucket {
    private capacity: number;
    private tokens: Map<string, number>;
    private lastRefillTime: Map<string, number>;
    private refillRate: number;
    private refillRateUnit : RefillRateTimeUnit;
    private burstPeriod : number;
    private storageOption : StorageOption;
    private redisClient?: Redis;
  
    constructor(
      capacity: number, 
      refillRate: number, 
      refillRateUnit: RefillRateTimeUnit,
      storageOption: StorageOption , 
      burstPeriod? : number, 
      redisOptions? : RedisOptions
    ) {
      if (capacity < 1) {
        throw new Error('Capacity must be greater than or equal to 1.');
      }
  
      if (refillRate < 0) {
        throw new Error('Refill rate must be greater than or equal to 0.');
      }
      this.capacity = capacity;
      this.tokens = new Map<string, number>();
      this.lastRefillTime = new Map<string, number>();
      this.refillRate = refillRate;
      this.refillRateUnit = refillRateUnit;
      this.burstPeriod = burstPeriod;
      this.storageOption= storageOption;

      if(this.storageOption==StorageOption.Redis){
        try {
          this.redisClient = new Redis(redisOptions);
        } catch (error) {
          throw new Error(error.message);
        }
        
      }

    }

    private getRefillRateInSeconds(): number {
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
  
    private refill(key: string) {
      const now = Date.now();
      if(!this.tokens.has(key)){
        
        this.tokens.set(key, this.capacity);
        this.lastRefillTime.set(key, now);
        return;
      }
      const timeElapsed = now - this.lastRefillTime.get(key);
      const newTokens = (timeElapsed / 1000) * this.getRefillRateInSeconds();
  
   
      this.tokens.set(key, Math.min(this.tokens.get(key)! + newTokens, this.capacity));  
      this.lastRefillTime.set(key, now);
    }
  
    public isAllowed(key?: string): boolean {
      if(!key)key='global'
      this.refill(key);
  
      if (this.tokens.get(key) >= 1) {
        return true;
      }
  
      return false;
    }
  
    public consumeToken(key? : string): boolean {
      if(!key)key='global'
      this.refill(key);
      
      if (this.tokens.get(key) >= 1) {
        this.tokens.set(key, this.tokens.get(key)-1);
        return true;
      }
  
      return false;
    }
  }
  