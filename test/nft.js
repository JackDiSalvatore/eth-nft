const { expectEvent, expectRevert } = require('@openzeppelin/test-helpers')
const NFT = artifacts.require('NFT')

contract('NFT', async (accounts) => {
  let nft;
  const deployer = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];
  const carl = accounts[3];

  beforeEach('Contract should be deployed', async () => {
    nft = await NFT.new(deployer);
  });

  describe('Should allow appoved sender to transfer an NFT', async () => {

    beforeEach('Deployer approves alice to transfer NFTs on there behalf', async () => {
      //console.log('owner of NFT 0: ' + await nft.ownerOf(0));
      //console.log('deployer: ' + deployer); 
      const receipt = await nft.approve(alice, 0, {from: deployer});
      const approved = await nft.getApproved(0);

      expectEvent(receipt, 'Approval', {
        owner: deployer,
        approved: approved,
        tokenId: web3.utils.toBN(0)
      })
      assert(approved == alice, 'alice was not successfully approved');
    });

    it('Should let the approved sender (alice) send the approved nft (0)',
      async () => {
      const receipt = await nft.transferFrom(deployer, bob, 0, {from: alice});
      const ownernft0 = await nft.ownerOf(0);   // Should be bob
      assert(ownernft0 === bob, 'bob did not receive transfer');
    });

    it('Should not let the approved sender (alice) send the approvded nft (0) ' +
      'if the previous owner (deployer) transfers the token to carl',
      async () => {
      // transfer: deployer -> carl {signed_by: deployer}
      await nft.transferFrom(deployer, carl, 0, {from: deployer});

      await expectRevert(
        // transfer: carl -> bob {signed_by: alice}
        nft.transferFrom(carl, bob, 0, {from: alice}),
        'transfer caller is not owner nor approved.'
      );
    });

  });
});
