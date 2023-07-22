import { expect } from 'chai';
import { RefillRateTimeUnit, TokenBucket } from '../src/TokenBucket';


describe('TokenBucket', () => {
 
    it('should allow consuming tokens at the refill rate', function (done) {
        
        this.timeout(1500); // Increase the timeout to 5 seconds
    
        const capacity = 2;
        const refillRate = 2;
        const bucket = new TokenBucket(capacity, refillRate, RefillRateTimeUnit.Second);
    

        expect(bucket.consumeToken()).to.be.true;
        expect(bucket.consumeToken()).to.be.true;
    
        setTimeout(() => {
           
          expect(bucket.consumeToken()).to.be.true;
          expect(bucket.consumeToken()).to.be.true;
    
          expect(bucket.consumeToken()).to.be.false;
          expect(bucket.consumeToken()).to.be.false;
    
          done(); 
        }, (capacity / refillRate) * 1000 + 100); 
      });

    it('should correctly report if a token is allowed or not', () => {
        const capacity = 5;
        const refillRate = 1;
        const bucket = new TokenBucket(capacity, refillRate, RefillRateTimeUnit.Second);

        expect(bucket.isAllowed()).to.be.true;

    
        for (let i = 0; i < capacity; i++) {
        bucket.consumeToken();
        }

        
        expect(bucket.isAllowed()).to.be.false;

        
        const waitTime = capacity / refillRate * 1000;
        setTimeout(() => {
        expect(bucket.isAllowed()).to.be.true;
        }, waitTime + 100); 
    });

    it('it should check for input validations', ()=>{
        
        expect(() => new TokenBucket(0, -5, RefillRateTimeUnit.Minute)).to.throw(
            'Capacity must be greater than or equal to 1.'
        );

        expect(() => new TokenBucket(5, -2, RefillRateTimeUnit.Month)).to.throw(
            'Refill rate must be greater than or equal to 0.'
        )
        
    });


});
