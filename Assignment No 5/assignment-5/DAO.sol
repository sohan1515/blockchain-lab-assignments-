// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SimpleDAO
 * @author Blockchain Student
 * @notice A simple Decentralized Autonomous Organization (DAO) smart contract
 * @dev This contract demonstrates basic DAO functionality including proposal creation, voting, and execution
 */

contract SimpleDAO {
    
    // ============ STATE VARIABLES ============
    
    /// @notice Stores information about each proposal
    /// @dev Mapping from proposal ID to Proposal struct
    mapping(uint256 => Proposal) public proposals;
    
    /// @notice Tracks if an address has voted on a proposal
    /// @dev Mapping: proposalId => voter address => hasVoted (boolean)
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    /// @notice Counter for total number of proposals created
    uint256 public proposalCount = 0;
    
    /// @notice Minimum voting period in seconds (3 days = 259200 seconds)
    uint256 public constant VOTING_PERIOD = 3 days;
    
    // ============ STRUCTS ============
    
    /**
     * @dev Proposal struct containing all information about a proposal
     * @param id Unique identifier for the proposal
     * @param title Brief title of the proposal
     * @param description Detailed description of what the proposal aims to achieve
     * @param proposer Address of the account that created this proposal
     * @param creationTime Timestamp when the proposal was created
     * @param deadline Timestamp when voting for this proposal ends
     * @param yesVotes Number of votes in favor of the proposal
     * @param noVotes Number of votes against the proposal
     * @param executed Boolean flag indicating if the proposal has been executed
     * @param passed Boolean flag indicating if the proposal passed (yesVotes > noVotes)
     */
    struct Proposal {
        uint256 id;
        string title;
        string description;
        address proposer;
        uint256 creationTime;
        uint256 deadline;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        bool passed;
    }
    
    // ============ EVENTS ============
    
    /**
     * @dev Emitted when a new proposal is created
     * @param proposalId ID of the newly created proposal
     * @param title Title of the proposal
     * @param proposer Address that created the proposal
     * @param deadline Voting deadline for this proposal
     */
    event ProposalCreated(
        uint256 indexed proposalId,
        string title,
        address indexed proposer,
        uint256 deadline
    );
    
    /**
     * @dev Emitted when someone votes on a proposal
     * @param proposalId ID of the proposal being voted on
     * @param voter Address of the voter
     * @param vote True for YES vote, False for NO vote
     */
    event Voted(
        uint256 indexed proposalId,
        address indexed voter,
        bool vote
    );
    
    /**
     * @dev Emitted when a proposal is executed after voting deadline
     * @param proposalId ID of the executed proposal
     * @param passed Whether the proposal passed (true) or failed (false)
     * @param yesVotes Final count of YES votes
     * @param noVotes Final count of NO votes
     */
    event ExecutedProposal(
        uint256 indexed proposalId,
        bool passed,
        uint256 yesVotes,
        uint256 noVotes
    );
    
    // ============ FUNCTIONS ============
    
    /**
     * @notice Creates a new proposal that can be voted on
     * @dev Increments proposal count and sets voting deadline to current time + VOTING_PERIOD
     * @param _title Title of the proposal (max 100 characters recommended)
     * @param _description Description of the proposal (max 500 characters recommended)
     * 
     * Requirements:
     * - Title must not be empty
     * - Description must not be empty
     * 
     * Emits: {ProposalCreated} event
     */
    function createProposal(string memory _title, string memory _description) public {
        // Validate inputs
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");
        
        // Create new proposal
        uint256 newProposalId = proposalCount;
        uint256 votingDeadline = block.timestamp + VOTING_PERIOD;
        
        proposals[newProposalId] = Proposal({
            id: newProposalId,
            title: _title,
            description: _description,
            proposer: msg.sender,
            creationTime: block.timestamp,
            deadline: votingDeadline,
            yesVotes: 0,
            noVotes: 0,
            executed: false,
            passed: false
        });
        
        // Increment proposal count for next proposal
        proposalCount++;
        
        // Emit event
        emit ProposalCreated(newProposalId, _title, msg.sender, votingDeadline);
    }
    
    /**
     * @notice Allows an address to vote on an active proposal
     * @dev Each address can only vote once per proposal
     * @param _proposalId ID of the proposal to vote on
     * @param _vote True for YES vote, False for NO vote
     * 
     * Requirements:
     * - Proposal must exist (proposalId < proposalCount)
     * - Voting deadline must not have passed (block.timestamp <= deadline)
     * - Voter must not have already voted on this proposal
     * - Proposal must not have been executed
     * 
     * Emits: {Voted} event
     */
    function vote(uint256 _proposalId, bool _vote) public {
        // Validate proposal exists
        require(_proposalId < proposalCount, "Proposal does not exist");
        
        Proposal storage proposal = proposals[_proposalId];
        
        // Validate voting is still open
        require(
            block.timestamp <= proposal.deadline,
            "Voting period has ended for this proposal"
        );
        
        // Validate voter hasn't already voted
        require(
            !hasVoted[_proposalId][msg.sender],
            "You have already voted on this proposal"
        );
        
        // Validate proposal hasn't been executed
        require(
            !proposal.executed,
            "Proposal has already been executed"
        );
        
        // Record vote
        hasVoted[_proposalId][msg.sender] = true;
        
        // Count the vote
        if (_vote) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }
        
        // Emit event
        emit Voted(_proposalId, msg.sender, _vote);
    }
    
    /**
     * @notice Executes a proposal after the voting deadline has passed
     * @dev Determines if the proposal passed by comparing YES and NO votes
     * @param _proposalId ID of the proposal to execute
     * 
     * Requirements:
     * - Proposal must exist
     * - Voting deadline must have passed
     * - Proposal must not have been executed already
     * 
     * Effects:
     * - Marks proposal as executed
     * - Sets the passed flag based on vote comparison
     * - Emits ExecutedProposal event with final vote counts
     * 
     * Emits: {ExecutedProposal} event
     */
    function executeProposal(uint256 _proposalId) public {
        // Validate proposal exists
        require(_proposalId < proposalCount, "Proposal does not exist");
        
        Proposal storage proposal = proposals[_proposalId];
        
        // Validate voting period has ended
        require(
            block.timestamp > proposal.deadline,
            "Voting period has not ended yet"
        );
        
        // Validate proposal hasn't been executed
        require(
            !proposal.executed,
            "Proposal has already been executed"
        );
        
        // Mark as executed
        proposal.executed = true;
        
        // Determine if proposal passed (YES votes > NO votes)
        if (proposal.yesVotes > proposal.noVotes) {
            proposal.passed = true;
        } else {
            proposal.passed = false;
        }
        
        // Emit execution event
        emit ExecutedProposal(
            _proposalId,
            proposal.passed,
            proposal.yesVotes,
            proposal.noVotes
        );
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @notice Gets detailed information about a specific proposal
     * @param _proposalId ID of the proposal to retrieve
     * @return Proposal struct containing all proposal data
     */
    function getProposal(uint256 _proposalId) 
        public 
        view 
        returns (Proposal memory) 
    {
        require(_proposalId < proposalCount, "Proposal does not exist");
        return proposals[_proposalId];
    }
    
    /**
     * @notice Checks if the voting period for a proposal is still active
     * @param _proposalId ID of the proposal to check
     * @return Boolean indicating if voting is still open
     */
    function isVotingOpen(uint256 _proposalId) 
        public 
        view 
        returns (bool) 
    {
        require(_proposalId < proposalCount, "Proposal does not exist");
        return block.timestamp <= proposals[_proposalId].deadline;
    }
    
    /**
     * @notice Gets the current vote count for a proposal
     * @param _proposalId ID of the proposal
     * @return yesCount Number of YES votes
     * @return noCount Number of NO votes
     */
    function getVoteCount(uint256 _proposalId) 
        public 
        view 
        returns (uint256 yesCount, uint256 noCount) 
    {
        require(_proposalId < proposalCount, "Proposal does not exist");
        Proposal storage proposal = proposals[_proposalId];
        return (proposal.yesVotes, proposal.noVotes);
    }
    
    /**
     * @notice Gets the total number of proposals created
     * @return Total count of all proposals
     */
    function getTotalProposals() 
        public 
        view 
        returns (uint256) 
    {
        return proposalCount;
    }
}
