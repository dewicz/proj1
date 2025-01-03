const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Counter', () => {
    it('stores the count', async () => {
        //fetch the count
        //check count to make sure it's what we expect
        const Counter = await ethers.getContractFactory('Counter')
        const counter = await Counter.deploy('MyCounter', 1)
        const count = await counter.count()
        expect(count).to.equal(1)
    })
})