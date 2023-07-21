export class TokenBucket {
    private capacity: number;
    private tokens: number;
    private lastRefillTime: number;
    private refillRate: number;
  
    constructor(capacity: number, refillRate: number) {
      if (capacity < 1) {
        throw new Error('Capacity must be greater than or equal to 1.');
      }
  
      if (refillRate < 0) {
        throw new Error('Refill rate must be greater than or equal to 0.');
      }
      this.capacity = capacity;
      this.tokens = capacity;
      this.lastRefillTime = Date.now();
      this.refillRate = refillRate;
    }
  
    private refill() {
      const now = Date.now();
      const timeElapsed = now - this.lastRefillTime;
      const newTokens = (timeElapsed / 1000) * this.refillRate;
  
      this.tokens = Math.min(this.tokens + newTokens, this.capacity);
      this.lastRefillTime = now;
    }
  
    public isAllowed(): boolean {
      this.refill();
  
      if (this.tokens >= 1) {
        return true;
      }
  
      return false;
    }
  
    public consumeToken(): boolean {
      this.refill();
  
      if (this.tokens >= 1) {
        this.tokens--;
        return true;
      }
  
      return false;
    }
  }
  