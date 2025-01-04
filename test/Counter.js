const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Counter', () => {

    let counter
    beforeEach(async () => {
        const Counter = await ethers.getContractFactory('Counter')
        counter = await Counter.deploy('MyCounter', 1)
    })

    describe('Deployment', () => {
        it('sets the initial count', async () => {
            const count = await counter.count()
            expect(count).to.equal(1)
        })
    
        it('sets the initial name', async () => {
            //fetch the count
            //check count to make sure it's what we expect
            const name = await counter.name()
            expect(name).to.equal('MyCounter')
        })
    })

    describe('Counting', () => {

        it('reads from the "count" public var', async () => {
            expect(await counter.count()).to.equal(1)
        })

        it('reads from the "getCount()" function', async () => {
            expect(await counter.getCount()).to.equal(1)
            
        })

        it('increments the count', async() => {
            transaction = await counter.increment();
            await transaction.wait();
            expect(await counter.count()).to.equal(2);

            transaction = await counter.increment();
            await transaction.wait();
            expect(await counter.count()).to.equal(3);
        })

        it('decrements the count', async() => {
            transaction = await counter.decrement();
            await transaction.wait();
            expect(await counter.count()).to.equal(0);

            //Cannot decrement below 0
            await expect(counter.decrement()).to.be.reverted
        })

        it('reads name from "name" public var', async () => {
            expect(await counter.name()).to.equal('MyCounter')
        })

        it('reads from the "getName()" function', async () => {
            expect(await counter.getName()).to.equal('MyCounter') 
        })

        it('updates the name', async () => {
            transaction = await counter.setName('New name')
            await transaction.wait()
            expect(await counter.getName()).to.equal('New name')
        })
    })
    
})