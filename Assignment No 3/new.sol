// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title StudentIPFSRegistry
/// @notice Stores one IPFS CID per student wallet on Sepolia for classroom verification
contract StudentIPFSRegistry {
    struct Submission {
        string studentId;
        string cid;
        address studentWallet;
        uint256 timestamp;
    }

    Submission[] private submissions;
    mapping(address => bool) public hasSubmitted;

    event SubmissionStored(
        uint256 indexed index,
        string studentId,
        string cid,
        address indexed studentWallet,
        uint256 timestamp
    );

    error AlreadySubmitted();
    error EmptyStudentId();
    error EmptyCid();

    /// @notice Submit your final report CID once from your wallet
    /// @param studentId Your college roll number / PRN / assigned ID
    /// @param cid IPFS CID of the uploaded report
    function submitSubmission(string calldata studentId, string calldata cid) external {
        if (bytes(studentId).length == 0) revert EmptyStudentId();
        if (bytes(cid).length == 0) revert EmptyCid();
        if (hasSubmitted[msg.sender]) revert AlreadySubmitted();

        hasSubmitted[msg.sender] = true;

        submissions.push(
            Submission({
                studentId: studentId,
                cid: cid,
                studentWallet: msg.sender,
                timestamp: block.timestamp
            })
        );

        emit SubmissionStored(
            submissions.length - 1,
            studentId,
            cid,
            msg.sender,
            block.timestamp
        );
    }

    /// @notice Total number of submissions stored
    function totalSubmissions() external view returns (uint256) {
        return submissions.length;
    }

    /// @notice Read a submission by index
    function getSubmission(uint256 index)
        external
        view
        returns (
            string memory studentId,
            string memory cid,
            address studentWallet,
            uint256 timestamp
        )
    {
        require(index < submissions.length, "Invalid index");
        Submission memory s = submissions[index];
        return (s.studentId, s.cid, s.studentWallet, s.timestamp);
    }

    /// @notice Return all submission data in arrays for easy viewing
    function getAllSubmissions()
        external
        view
        returns (
            string[] memory studentIds,
            string[] memory cids,
            address[] memory wallets,
            uint256[] memory timestamps
        )
    {
        uint256 len = submissions.length;

        studentIds = new string[](len);
        cids = new string[](len);
        wallets = new address[](len);
        timestamps = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            studentIds[i] = submissions[i].studentId;
            cids[i] = submissions[i].cid;
            wallets[i] = submissions[i].studentWallet;
            timestamps[i] = submissions[i].timestamp;
        }
    }
}
