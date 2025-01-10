const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
  }
  
const ether = tokens

describe('FlashLoan', () => {
    let token, flashLoan, flashLoanReceiver;

    beforeEach(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]

        const FlashLoan = await ethers.getContractFactory('FlashLoan');
        const FlashLoanReceiver = await ethers.getContractFactory('FlashLoanReceiver');
        const Token = await ethers.getContractFactory('Token');

        //Deploy token
        token = await Token.deploy('Dapp University', 'DAPP', '1000000')
      
        //Deploy flash loan pool
        flashLoan = await FlashLoan.deploy(token.getAddress())
   
        let transaction = await token.connect(deployer).approve(flashLoan.getAddress(), tokens(1000000))
        await transaction.wait()
        
        transaction = await flashLoan.connect(deployer).depositTokens(tokens(1000000))
        await transaction.wait()

        //deploy flash loan receiver
        flashLoanReceiver = await FlashLoanReceiver.deploy(flashLoan.getAddress())

    })


    describe('Deployment', () => {

        it('works', async () => {
            expect(await token.balanceOf(flashLoan.getAddress())).to.equal(tokens(1000000))
        })
    })

    describe('Borrowing funds', () => {
        it('borrows funds from the pool', async () => {
            let amount = tokens(100)
            let transaction = await flashLoanReceiver.connect(deployer).executeFlashLoan(amount)
            let result = await transaction.wait()
        })
    })


})