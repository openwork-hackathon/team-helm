// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title HELMStaking
 * @notice Simple ERC-20 lock contract for HELM token staking tiers
 * @dev Allows users to stake HELM tokens to unlock feature tiers
 */

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract HELMStaking is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // ============ State Variables ============
    
    IERC20 public immutable helmToken;
    
    // Tier thresholds (in HELM tokens, 18 decimals)
    uint256 public constant HELM_TIER = 1_000 * 10**18;      // 1,000 HELM
    uint256 public constant NAVIGATOR_TIER = 10_000 * 10**18; // 10,000 HELM
    uint256 public constant FLEET_TIER = 100_000 * 10**18;    // 100,000 HELM
    
    // Staking info per user
    struct StakeInfo {
        uint256 amount;
        uint256 since;
        uint256 lastClaim;
    }
    
    mapping(address => StakeInfo) public stakes;
    
    // Total staked
    uint256 public totalStaked;
    
    // ============ Events ============
    
    event Staked(address indexed user, uint256 amount, uint256 tier);
    event Unstaked(address indexed user, uint256 amount);
    event TierUpgraded(address indexed user, uint256 newTier);
    event TierDowngraded(address indexed user, uint256 newTier);
    
    // ============ Errors ============
    
    error InsufficientBalance();
    error NoStakeFound();
    error EmergencyWithdrawDisabled();
    
    // ============ Constructor ============
    
    constructor(address _helmToken) Ownable(msg.sender) {
        require(_helmToken != address(0), "Invalid token address");
        helmToken = IERC20(_helmToken);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get user's current stake amount
     */
    function getStake(address _user) external view returns (uint256) {
        return stakes[_user].amount;
    }
    
    /**
     * @notice Get user's tier level (0-3)
     * @return 0 = Free, 1 = HELM, 2 = Navigator, 3 = Fleet
     */
    function getTier(address _user) external view returns (uint256) {
        uint256 amount = stakes[_user].amount;
        
        if (amount >= FLEET_TIER) return 3;
        if (amount >= NAVIGATOR_TIER) return 2;
        if (amount >= HELM_TIER) return 1;
        return 0;
    }
    
    /**
     * @notice Check if user has at least a specific tier
     */
    function hasTier(address _user, uint256 _minTier) external view returns (bool) {
        return this.getTier(_user) >= _minTier;
    }
    
    /**
     * @notice Get tier name as string
     */
    function getTierName(uint256 _tier) external pure returns (string memory) {
        if (_tier == 3) return "Fleet";
        if (_tier == 2) return "Navigator";
        if (_tier == 1) return "HELM";
        return "Free";
    }
    
    /**
     * @notice Get amount needed to reach next tier
     */
    function amountToNextTier(address _user) external view returns (uint256) {
        uint256 current = stakes[_user].amount;
        
        if (current < HELM_TIER) {
            return HELM_TIER - current;
        } else if (current < NAVIGATOR_TIER) {
            return NAVIGATOR_TIER - current;
        } else if (current < FLEET_TIER) {
            return FLEET_TIER - current;
        }
        return 0; // Already at max tier
    }
    
    // ============ Staking Functions ============
    
    /**
     * @notice Stake HELM tokens
     * @param _amount Amount to stake (in wei, 18 decimals)
     */
    function stake(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Cannot stake 0");
        
        uint256 previousTier = this.getTier(msg.sender);
        
        // Transfer tokens from user
        helmToken.safeTransferFrom(msg.sender, address(this), _amount);
        
        // Update stake
        StakeInfo storage userStake = stakes[msg.sender];
        userStake.amount += _amount;
        
        if (userStake.since == 0) {
            userStake.since = block.timestamp;
        }
        
        totalStaked += _amount;
        
        // Check for tier upgrade
        uint256 newTier = this.getTier(msg.sender);
        if (newTier > previousTier) {
            emit TierUpgraded(msg.sender, newTier);
        }
        
        emit Staked(msg.sender, _amount, newTier);
    }
    
    /**
     * @notice Unstake HELM tokens
     * @param _amount Amount to unstake (in wei, 18 decimals)
     */
    function unstake(uint256 _amount) external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        
        if (userStake.amount == 0) revert NoStakeFound();
        require(_amount <= userStake.amount, "Insufficient staked amount");
        
        uint256 previousTier = this.getTier(msg.sender);
        
        // Update stake
        userStake.amount -= _amount;
        totalStaked -= _amount;
        
        // Transfer tokens back to user
        helmToken.safeTransfer(msg.sender, _amount);
        
        // Check for tier downgrade
        uint256 newTier = this.getTier(msg.sender);
        if (newTier < previousTier) {
            emit TierDowngraded(msg.sender, newTier);
        }
        
        emit Unstaked(msg.sender, _amount);
    }
    
    /**
     * @notice Unstake all tokens
     */
    function unstakeAll() external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        uint256 amount = userStake.amount;
        
        if (amount == 0) revert NoStakeFound();
        
        // Reset stake
        userStake.amount = 0;
        userStake.since = 0;
        totalStaked -= amount;
        
        // Transfer tokens back
        helmToken.safeTransfer(msg.sender, amount);
        
        emit TierDowngraded(msg.sender, 0);
        emit Unstaked(msg.sender, amount);
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Emergency recover tokens (only owner, for stuck tokens)
     * @param _token Token to recover
     * @param _amount Amount to recover
     */
    function recoverToken(address _token, uint256 _amount) external onlyOwner {
        require(_token != address(helmToken), "Cannot recover HELM tokens");
        IERC20(_token).safeTransfer(owner(), _amount);
    }
    
    /**
     * @notice Get contract HELM balance (should equal totalStaked)
     */
    function getContractBalance() external view returns (uint256) {
        return helmToken.balanceOf(address(this));
    }
}
