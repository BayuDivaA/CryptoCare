// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.15;

contract CryptoCareFactory {
    address constant superAdmin = 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4;

    mapping(address => bool) admin;
    mapping(address => bool) public verifiedAddress;
    mapping(address => string) public userName;

    uint public campaignCount;
    Campaign[] public deployedCampaign;

    function getAddress(address _user) external view returns (bool, string memory) {
        return (verifiedAddress[_user], userName[_user]);
    }

    // ACCESS MODIFIER ====
    modifier onlyVerified() {
        require(verifiedAddress[msg.sender] == true, "Your address not verified!");
        _;
    }
    modifier onlySuperAdmin() {
        require(superAdmin == msg.sender);
        _;
    }
    modifier onlyAdmin() {
        require(admin[msg.sender] == true);
        _;
    }
    
    // FUNCTION SET n UNSET ADMIN (SUPER ADMIN)
    function setToAdmin(address _user) public onlySuperAdmin{
        admin[_user] = true;
    }

    function deleteAdmin(address _user) public onlySuperAdmin{
        admin[_user] = false;
    }

    // FUNCTION VERIF n UNVERIF USER (ADMIN)
    function setAddressVerified(address _user, string memory _name) public onlyAdmin {
        verifiedAddress[_user] = true;
        userName[_user] = _name;
    }    

    function setAddressUnverified(address _user) public onlyAdmin {
        verifiedAddress[_user] = false;
    }

    // Function Set UserName
    function setUsername(address _user, string memory _name) public onlyVerified {
        userName[_user] = _name;
    } 

    //CREATE NEW Regular CAMPAIGN
    function createCampaigns(string memory _title, string memory _url, string memory _story, uint _duration, uint _target, uint _tipes, string memory _category, string memory _recName, string memory _recLoc, uint _minimum) public
    {
        campaignCount += 1;
        // Normal = 0
        // Urgent = 1
        Campaign newCampaigns = new Campaign(_title, _url, _story, block.timestamp, _duration, msg.sender,_target, _tipes, _category, _recName, _recLoc, _minimum);
        deployedCampaign.push(newCampaigns); 
    }
}

contract Campaign {
    mapping(address => bool) contributor; // Check for user contributed or not
    mapping(address => bool) reported; // User already reported
    mapping(address => uint) donatedValue; // User donated valu

    CryptoCareFactory ccf;
    
    uint public contributorsCount;
    uint campaignReport;
    uint collectedFunds;
    bool campaignActive;

    address[] contributors;
    uint[] donations;

    string campaignTitle; //*
    string campaignUrl; //*
    string[] campaignStory; //*
    uint campaignTimestamp;
    uint campaignDuration; //*
    address campaignCreator;
    uint campaignTarget; //*
    uint campaignTypes; //*
    string campaignCategory; //*
    string recipientName; //*
    string recipientLoc; //*
    uint minimContribution; //*

    constructor(string memory _title, string memory _url, string memory _story, uint _date, uint _duration, address _creator, uint _target, uint _tipes, string memory _category, string memory _recName, string memory _recLoc, uint _minimum) {
        campaignTitle = _title;
        campaignUrl = _url;
        campaignStory.push(_story);
        campaignTimestamp = _date;
        campaignDuration = _duration;
        campaignCreator = _creator;
        campaignTarget = _target;
        campaignTypes = _tipes;
        campaignCategory = _category;
        recipientName = _recName;
        recipientLoc = _recLoc;
        minimContribution = _minimum;

        collectedFunds = 0;
        campaignActive = true;
    }
    
    
    //Access Modifier ====

    modifier onlyOwner() {
        require(msg.sender == campaignCreator);
        _;
    }

    modifier onlyContributor() {
        require(contributor[msg.sender]);
        _;
    }

    // DONATE FUNCTION ====
    function contribute() public payable {
        uint256 amount = msg.value;
        uint256 userValue =  donatedValue[msg.sender];

        contributors.push(msg.sender);
        donations.push(amount);

        collectedFunds = collectedFunds + amount;
        userValue = userValue + amount;
        
        require(msg.value >= minimContribution);        
        contributor[msg.sender] = true;
    } 

    function getUsedBalance() public view returns(uint256) {
        uint usedBalance = (collectedFunds - address(this).balance) / collectedFunds * 100;

        return usedBalance;
    }
    
    // Withdrawl Request Struct ===
    struct WithdrawlStruct {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint completedTimestamp;
        uint approvalsCount;
        mapping(address => bool) approvals;
    }

    WithdrawlStruct[] public withdrawls;
    uint wdIndex;

    // Create Withdrawl Request
    function createWithdrawl(string memory description, uint value, address payable recipient) public onlyOwner{      
        WithdrawlStruct storage r = withdrawls[wdIndex++];
            r.description = description;
            r.value = value;
            r.recipient = recipient;
            r.complete = false;
            r.completedTimestamp = block.timestamp;
            r.approvalsCount = 0;
    }

    // Approve Withdrawl Request
    function approvalWithdrawl(uint index) public onlyContributor {
        WithdrawlStruct storage w = withdrawls[index];

        require(!w.approvals[msg.sender]);

        w.approvals[msg.sender] = true;
        w.approvalsCount++;
    }

    // Finalize Withdrawl
    function finalizeWd(uint index) public onlyOwner{
        WithdrawlStruct storage wd = withdrawls[index];

        require(wd.approvalsCount >= (contributorsCount / 1));
        require(!wd.complete);
        wd.recipient.transfer(wd.value);
        wd.complete = true;
    }

    function urgentWd(string memory description, address payable recipient) public payable onlyOwner{
        uint256 wdValue = msg.value;

        WithdrawlStruct storage wd = withdrawls[wdIndex++];
        require(!wd.complete);
        require(wdValue >= address(this).balance, "Not enough amount");

        // wd.recipient.transfer(value);
        (bool sent, ) = payable(wd.recipient).call{value: wdValue}("");

        if(sent){
            wd.description = description;
            wd.value = wdValue;
            wd.recipient = recipient;
            wd.completedTimestamp = block.timestamp;
            wd.approvalsCount = 0;
            wd.complete = true;
        }      
    }

    function reportCampaign () public onlyContributor{
        require(reported[msg.sender] == false);
        
        campaignReport++;
        reported[msg.sender] = true;
        if (campaignReport >= (contributorsCount/2)){
            campaignActive = false;
        }
    }

    function refundDonate(uint value) public onlyContributor {
        require(donatedValue[msg.sender] > 0);

        payable(address(msg.sender)).transfer(value);
 
        contributor[msg.sender] = false;
    } 
}