const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Test Suite for SimpleDAO Smart Contract
 * 
 * These tests verify:
 * - Proposal creation
 * - Voting functionality
 * - Vote counting
 * - Proposal execution
 * - Error handling and validation
 */

describe("SimpleDAO", function () {
    let dao;
    let owner;
    let addr1;
    let addr2;
    let addr3;

    /**
     * Setup: Deploy a fresh contract before each test
     */
    beforeEach(async function () {
        // Get test accounts
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Deploy contract
        const SimpleDAO = await ethers.getContractFactory("SimpleDAO");
        dao = await SimpleDAO.deploy();
        await dao.deployed();
    });

    // ============ PROPOSAL CREATION TESTS ============

    describe("Proposal Creation", function () {
        
        /**
         * TEST 1: Should successfully create a proposal
         * Verifies: Proposal is stored with correct data
         */
        it("Should create a proposal successfully", async function () {
            const title = "Increase marketing budget";
            const description = "Allocate 100 ETH for Q2 marketing campaign";

            await dao.createProposal(title, description);

            const proposal = await dao.getProposal(0);
            expect(proposal.id).to.equal(0);
            expect(proposal.title).to.equal(title);
            expect(proposal.description).to.equal(description);
            expect(proposal.proposer).to.equal(owner.address);
            expect(proposal.yesVotes).to.equal(0);
            expect(proposal.noVotes).to.equal(0);
            expect(proposal.executed).to.be.false;
            expect(proposal.passed).to.be.false;
        });

        /**
         * TEST 2: Should emit ProposalCreated event
         * Verifies: Event is fired with correct parameters
         */
        it("Should emit ProposalCreated event", async function () {
            const title = "New feature";
            const description = "Implement dark mode";

            await expect(dao.createProposal(title, description))
                .to.emit(dao, "ProposalCreated")
                .withArgs(0, title, owner.address, expect.any(BigInt));
        });

        /**
         * TEST 3: Should increment proposal count
         * Verifies: Multiple proposals can be created
         */
        it("Should increment proposal count", async function () {
            await dao.createProposal("Proposal 1", "Description 1");
            expect(await dao.getTotalProposals()).to.equal(1);

            await dao.createProposal("Proposal 2", "Description 2");
            expect(await dao.getTotalProposals()).to.equal(2);

            await dao.createProposal("Proposal 3", "Description 3");
            expect(await dao.getTotalProposals()).to.equal(3);
        });

        /**
         * TEST 4: Should reject empty title
         * Verifies: Input validation works
         */
        it("Should reject proposal with empty title", async function () {
            await expect(
                dao.createProposal("", "Valid description")
            ).to.be.revertedWith("Title cannot be empty");
        });

        /**
         * TEST 5: Should reject empty description
         * Verifies: Input validation works
         */
        it("Should reject proposal with empty description", async function () {
            await expect(
                dao.createProposal("Valid title", "")
            ).to.be.revertedWith("Description cannot be empty");
        });

        /**
         * TEST 6: Should set correct voting deadline
         * Verifies: Deadline is 3 days from creation
         */
        it("Should set voting deadline to 3 days from creation", async function () {
            const blockTimeBefore = await ethers.provider.getBlock("latest");
            await dao.createProposal("Title", "Description");
            const blockTimeAfter = await ethers.provider.getBlock("latest");

            const proposal = await dao.getProposal(0);
            const expectedDeadline = blockTimeAfter.timestamp + 3 * 24 * 60 * 60;
            
            expect(proposal.deadline).to.be.closeTo(expectedDeadline, 2);
        });
    });

    // ============ VOTING TESTS ============

    describe("Voting", function () {
        
        beforeEach(async function () {
            // Create a proposal for voting tests
            await dao.createProposal("Test Proposal", "Test Description");
        });

        /**
         * TEST 7: Should allow voting YES
         * Verifies: YES vote is counted
         */
        it("Should record YES vote", async function () {
            await dao.vote(0, true);
            const [yesVotes, noVotes] = await dao.getVoteCount(0);
            expect(yesVotes).to.equal(1);
            expect(noVotes).to.equal(0);
        });

        /**
         * TEST 8: Should allow voting NO
         * Verifies: NO vote is counted
         */
        it("Should record NO vote", async function () {
            await dao.vote(0, false);
            const [yesVotes, noVotes] = await dao.getVoteCount(0);
            expect(yesVotes).to.equal(0);
            expect(noVotes).to.equal(1);
        });

        /**
         * TEST 9: Should emit Voted event
         * Verifies: Event is fired with correct parameters
         */
        it("Should emit Voted event", async function () {
            await expect(dao.vote(0, true))
                .to.emit(dao, "Voted")
                .withArgs(0, owner.address, true);
        });

        /**
         * TEST 10: Should count multiple votes
         * Verifies: Multiple different voters can vote
         */
        it("Should count votes from multiple voters", async function () {
            await dao.vote(0, true);                           // Owner votes YES
            await dao.connect(addr1).vote(0, true);           // addr1 votes YES
            await dao.connect(addr2).vote(0, false);          // addr2 votes NO
            await dao.connect(addr3).vote(0, true);           // addr3 votes YES

            const [yesVotes, noVotes] = await dao.getVoteCount(0);
            expect(yesVotes).to.equal(3);
            expect(noVotes).to.equal(1);
        });

        /**
         * TEST 11: Should prevent double voting
         * Verifies: Same address cannot vote twice
         */
        it("Should prevent same address from voting twice", async function () {
            await dao.vote(0, true);
            await expect(dao.vote(0, false))
                .to.be.revertedWith("You have already voted on this proposal");
        });

        /**
         * TEST 12: Should prevent voting on non-existent proposal
         * Verifies: Proposal must exist
         */
        it("Should reject vote on non-existent proposal", async function () {
            await expect(dao.vote(999, true))
                .to.be.revertedWith("Proposal does not exist");
        });

        /**
         * TEST 13: Should prevent voting after deadline
         * Verifies: Voting period enforcement
         */
        it("Should prevent voting after deadline", async function () {
            // Fast-forward time to after deadline (3 days + 1 second)
            await ethers.provider.send("hardhat_mine", ["0x" + (3*24*60*60 + 1).toString(16)]);

            await expect(dao.vote(0, true))
                .to.be.revertedWith("Voting period has ended for this proposal");
        });

        /**
         * TEST 14: Should prevent voting on executed proposal
         * Verifies: Cannot vote after execution
         */
        it("Should prevent voting on executed proposal", async function () {
            // Fast-forward to after deadline
            await ethers.provider.send("hardhat_mine", ["0x" + (3*24*60*60 + 1).toString(16)]);

            // Execute the proposal
            await dao.executeProposal(0);

            // Try to vote (should fail)
            await expect(dao.vote(0, true))
                .to.be.revertedWith("Proposal has already been executed");
        });
    });

    // ============ PROPOSAL EXECUTION TESTS ============

    describe("Proposal Execution", function () {
        
        /**
         * TEST 15: Should mark proposal as executed
         * Verifies: Execution flag is set
         */
        it("Should mark proposal as executed", async function () {
            await dao.createProposal("Test", "Test");
            
            // Fast-forward to after deadline
            await ethers.provider.send("hardhat_mine", ["0x" + (3*24*60*60 + 1).toString(16)]);

            await dao.executeProposal(0);
            const proposal = await dao.getProposal(0);
            expect(proposal.executed).to.be.true;
        });

        /**
         * TEST 16: Should pass proposal if YES > NO
         * Verifies: Correct vote comparison
         */
        it("Should pass proposal when YES votes > NO votes", async function () {
            await dao.createProposal("Test", "Test");
            await dao.vote(0, true);                    // YES
            await dao.connect(addr1).vote(0, true);    // YES
            await dao.connect(addr2).vote(0, false);   // NO

            // Fast-forward to after deadline
            await ethers.provider.send("hardhat_mine", ["0x" + (3*24*60*60 + 1).toString(16)]);

            await dao.executeProposal(0);
            const proposal = await dao.getProposal(0);
            expect(proposal.passed).to.be.true;
        });

        /**
         * TEST 17: Should fail proposal if NO >= YES
         * Verifies: Correct vote comparison
         */
        it("Should fail proposal when NO votes >= YES votes", async function () {
            await dao.createProposal("Test", "Test");
            await dao.vote(0, true);                    // YES
            await dao.connect(addr1).vote(0, false);   // NO
            await dao.connect(addr2).vote(0, false);   // NO

            // Fast-forward to after deadline
            await ethers.provider.send("hardhat_mine", ["0x" + (3*24*60*60 + 1).toString(16)]);

            await dao.executeProposal(0);
            const proposal = await dao.getProposal(0);
            expect(proposal.passed).to.be.false;
        });

        /**
         * TEST 18: Should emit ExecutedProposal event
         * Verifies: Event is fired with correct parameters
         */
        it("Should emit ExecutedProposal event", async function () {
            await dao.createProposal("Test", "Test");
            await dao.vote(0, true);
            await dao.connect(addr1).vote(0, false);

            // Fast-forward to after deadline
            await ethers.provider.send("hardhat_mine", ["0x" + (3*24*60*60 + 1).toString(16)]);

            await expect(dao.executeProposal(0))
                .to.emit(dao, "ExecutedProposal")
                .withArgs(0, false, 1, 1);
        });

        /**
         * TEST 19: Should prevent execution before deadline
         * Verifies: Deadline enforcement
         */
        it("Should prevent execution before deadline", async function () {
            await dao.createProposal("Test", "Test");
            await dao.vote(0, true);

            await expect(dao.executeProposal(0))
                .to.be.revertedWith("Voting period has not ended yet");
        });

        /**
         * TEST 20: Should prevent double execution
         * Verifies: Proposal can only be executed once
         */
        it("Should prevent executing proposal twice", async function () {
            await dao.createProposal("Test", "Test");

            // Fast-forward to after deadline
            await ethers.provider.send("hardhat_mine", ["0x" + (3*24*60*60 + 1).toString(16)]);

            await dao.executeProposal(0);
            
            await expect(dao.executeProposal(0))
                .to.be.revertedWith("Proposal has already been executed");
        });

        /**
         * TEST 21: Should prevent execution of non-existent proposal
         * Verifies: Proposal must exist
         */
        it("Should reject execution of non-existent proposal", async function () {
            // Fast-forward to after deadline
            await ethers.provider.send("hardhat_mine", ["0x" + (3*24*60*60 + 1).toString(16)]);

            await expect(dao.executeProposal(999))
                .to.be.revertedWith("Proposal does not exist");
        });
    });

    // ============ VIEW FUNCTION TESTS ============

    describe("View Functions", function () {
        
        /**
         * TEST 22: Should return proposal details
         * Verifies: getProposal() returns correct data
         */
        it("Should return proposal details", async function () {
            await dao.createProposal("Title", "Description");
            const proposal = await dao.getProposal(0);

            expect(proposal.title).to.equal("Title");
            expect(proposal.description).to.equal("Description");
            expect(proposal.proposer).to.equal(owner.address);
        });

        /**
         * TEST 23: Should check if voting is open
         * Verifies: isVotingOpen() works correctly
         */
        it("Should correctly identify if voting is open", async function () {
            await dao.createProposal("Test", "Test");

            expect(await dao.isVotingOpen(0)).to.be.true;

            // Fast-forward past deadline
            await ethers.provider.send("hardhat_mine", ["0x" + (3*24*60*60 + 1).toString(16)]);

            expect(await dao.isVotingOpen(0)).to.be.false;
        });

        /**
         * TEST 24: Should return vote count
         * Verifies: getVoteCount() returns correct counts
         */
        it("Should return correct vote count", async function () {
            await dao.createProposal("Test", "Test");
            await dao.vote(0, true);
            await dao.connect(addr1).vote(0, false);

            const [yes, no] = await dao.getVoteCount(0);
            expect(yes).to.equal(1);
            expect(no).to.equal(1);
        });

        /**
         * TEST 25: Should return total proposals
         * Verifies: getTotalProposals() counts correctly
         */
        it("Should return total number of proposals", async function () {
            expect(await dao.getTotalProposals()).to.equal(0);

            await dao.createProposal("P1", "D1");
            expect(await dao.getTotalProposals()).to.equal(1);

            await dao.createProposal("P2", "D2");
            expect(await dao.getTotalProposals()).to.equal(2);
        });
    });

    // ============ INTEGRATION TESTS ============

    describe("Integration Tests", function () {
        
        /**
         * TEST 26: Full DAO workflow
         * Verifies: Complete proposal lifecycle works
         */
        it("Should complete full workflow: create -> vote -> execute", async function () {
            // Step 1: Create proposal
            await dao.createProposal("Approve budget", "Allocate 100 ETH");
            expect(await dao.getTotalProposals()).to.equal(1);

            // Step 2: Vote
            await dao.vote(0, true);
            await dao.connect(addr1).vote(0, true);
            await dao.connect(addr2).vote(0, false);

            const [yesVotes, noVotes] = await dao.getVoteCount(0);
            expect(yesVotes).to.equal(2);
            expect(noVotes).to.equal(1);

            // Step 3: Execute
            await ethers.provider.send("hardhat_mine", ["0x" + (3*24*60*60 + 1).toString(16)]);
            await dao.executeProposal(0);

            const proposal = await dao.getProposal(0);
            expect(proposal.executed).to.be.true;
            expect(proposal.passed).to.be.true;
        });

        /**
         * TEST 27: Multiple proposals workflow
         * Verifies: Multiple proposals can coexist
         */
        it("Should handle multiple proposals independently", async function () {
            // Create multiple proposals
            await dao.createProposal("Proposal 1", "Description 1");
            await dao.createProposal("Proposal 2", "Description 2");

            // Vote differently on each
            await dao.vote(0, true);                    // P1: YES
            await dao.connect(addr1).vote(1, false);   // P2: NO

            // Check votes are independent
            const [p1Yes, p1No] = await dao.getVoteCount(0);
            const [p2Yes, p2No] = await dao.getVoteCount(1);

            expect(p1Yes).to.equal(1);
            expect(p1No).to.equal(0);
            expect(p2Yes).to.equal(0);
            expect(p2No).to.equal(1);
        });
    });
});
