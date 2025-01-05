const { expect } = require('chai');
const { ethers } = require('hardhat');


const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
  }
  
const ether = tokens

describe('RealEstate', () => {
    let realEstate, escrow
    let deployer, seller, buyer, inspector, lender
    let nftID = 1
    let purchasePrice = ether(100)
    let escrowAmount = ether(20)

    beforeEach(async () => {
        accounts = await ethers.getSigners()
        deployer = accounts[0]
        seller = deployer
        buyer = accounts[1]
        inspector = accounts[2]
        lender = accounts[3]

        const RealEstate = await ethers.getContractFactory('RealEstate');
        const Escrow = await ethers.getContractFactory('Escrow');

        realEstate = await RealEstate.deploy()
        escrow = await Escrow.deploy(
            realEstate.getAddress(),
            nftID,
            //ethers.utils.parseUnits('100', 'ether'),
            purchasePrice,
            escrowAmount,
            seller.getAddress(),
            buyer.getAddress(),
            inspector.getAddress(),
            lender.getAddress()
        )

        //seller approves nft, has to be done before transfer
        transaction = await realEstate.connect(seller).approve(escrow.getAddress(), nftID)
        await transaction.wait()

        
    })

    describe('Deployment', async () => {
        it('sends an NFT to the seller / deployer', async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
        })

    })

    describe('Selling real estate', async () => {
        let balance, transaction

        it('executes a successful transaction', async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
            
            //buyer deposits earnest
            transaction = await escrow.connect(buyer).depositEarnest({value: escrowAmount})

            //check escrow
            balance = await escrow.getBalance()
            console.log("escrow balance: ", ethers.formatEther(balance))

            //inspector update status 
            transaction = await escrow.connect(inspector).updateInspectionStatus(true)
            await transaction.wait();
            console.log('Inspector updates status')

            //approvals
            transaction = await escrow.connect(buyer).approveSale()
            await transaction.wait()
            console.log("Buyer approves sale")

            transaction = await escrow.connect(seller).approveSale()
            await transaction.wait()
            console.log("Seller approves sale")

            //lender funds sale
            transaction = await lender.sendTransaction({ to: escrow.getAddress(), value: ether(80) })

            transaction = await escrow.connect(lender).approveSale()
            await transaction.wait()
            console.log("Lender approves sale")

            //finalize sale
            transaction = await escrow.connect(buyer).finalizeSale()
            await transaction.wait()
            console.log("Buyer finalizes sale")
        
            expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address)

            balance = await ethers.provider.getBalance(seller.address)
            console.log('Seller balance:', ethers.formatEther(balance))
            expect(balance).to.be.above(ether(10099))

        })

    })
})