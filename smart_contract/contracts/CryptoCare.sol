// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract CampaignFactory {
    uint public campaignCount;
    uint public contributorCount;
    uint public etherCount;

    address newCampaigns;

    struct campaignStruct {
        address deployedCampaign;
        address cOowner;
        uint cDate;
        uint cMinimum;
        string cTitle;
        string cUrl;
        string cDescription;
        uint cDuration;
        uint cTarget;
    }

    campaignStruct[] public campaigns;

    function createCampaigns(uint _minimum, string memory _title, string memory _url, string memory _description, uint _duration, uint _target) public
    {
        uint minimum = _minimum;
        string memory title = _title;
        string memory url = _url;
        string memory description = _description;
        uint duration = _duration;
        uint target = _target;

        campaignCount += 1;

        newCampaigns = address(new Campaign(minimum,  block.timestamp,  msg.sender, title, url, description, duration, target));
        campaigns.push(campaignStruct(newCampaigns, msg.sender, block.timestamp, minimum, title, url, description, duration, target));
    }
}

contract Campaign {
    mapping(address => bool) contributors;
    uint public contributorsCount;
    CampaignFactory private cf;
    
    address owner;
    uint createDate;
    uint minimContribution;
    string campaignTitle;
    string campaignUrl;
    string campaignDescription;
    uint campaignDuration;
    uint campaignTarget;

    struct WithdrawalStruct {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalsCount;
        mapping(address => bool) approvals;

    }

    WithdrawalStruct[] public withdrawls;
    uint wdIndex;

    constructor(uint minim, uint date, address creator, string memory title, string memory url, string memory description, uint duration, uint target) {
        owner = creator;
        minimContribution = minim;
        campaignTitle = title;
        campaignUrl = url;
        campaignDescription = description;
        campaignDuration = duration;
        campaignTarget = target;
        createDate = date;

    }
    
    function contribute() public payable {
        if (contributors[msg.sender] == false) {
            require(msg.value >= minimContribution);
            contributors[msg.sender]=true;
            contributorsCount++;
        }            
    } 

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier onlyContributor() {
        require(contributors[msg.sender]);
        _;
    }

    function createWithdrawl(string memory description, uint value, address payable recipient) public onlyOwner {      
        WithdrawalStruct storage r = withdrawls[wdIndex++];
            r.description = description;
            r.value = value;
            r.recipient = recipient;
            r.complete = false;
            r.approvalsCount = 0;
    }

    function approvalWithdrawl(uint index) public onlyContributor {
        WithdrawalStruct storage w = withdrawls[index];

        require(!w.approvals[msg.sender]);

        w.approvals[msg.sender] = true;
        w.approvalsCount++;
    }

    function finalizeWd(uint index) public onlyOwner{
        WithdrawalStruct storage wd = withdrawls[index];

        require(wd.approvalsCount >= (contributorsCount / 2));
        require(!wd.complete);

        wd.recipient.transfer(wd.value);
        wd.complete = true;
    }
}