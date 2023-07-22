// Import the rate limiting algorithms from their respective files
import { TokenBucket, RefillRateTimeUnit } from './tokenBucket';


// Export the user-facing API class
export class RateLimiter {
  private algorithm: TokenBucket 
  // | LeakyBucket | RequestCount;

  constructor(
    algorithmName: 'token-bucket' | 'leaky-bucket' | 'request-count',
    capacity: number,
    refillRate:number
  ) {
    switch (algorithmName) {
      case 'token-bucket':
        this.algorithm = new TokenBucket(capacity, refillRate, RefillRateTimeUnit.Second);
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
  public consumeToken(): boolean {
    return this.algorithm.consumeToken();
  }

  public isAllowed(): boolean {
    return this.algorithm.isAllowed();
  }
}
