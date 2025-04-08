// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CompanyNFT.sol";
import "./PlatformToken.sol";

/**
 * @title Marketplace
 * @dev NFT marketplace supporting fixed price sales and auctions
 * 
 * This contract handles:
 * 1. Fixed price listings and sales
 * 2. Timed auctions with minimum bid increments
 * 3. Marketplace fees and token transfers
 * 4. Bid management and withdrawals
 */
contract Marketplace is ReentrancyGuard, Ownable {
    // ============ Structs ============

    struct Listing {
        address seller;        // Address of the NFT seller
        uint256 price;         // Fixed price or minimum bid for auction
        bool isAuction;        // Whether this is an auction listing
        uint256 auctionEndTime; // End time for auction (0 for fixed price)
        address highestBidder; // Current highest bidder in auction
        uint256 highestBid;   // Current highest bid in auction
        bool active;          // Whether the listing is active
    }

    // ============ Constants ============

    uint256 public constant MARKETPLACE_FEE = 100;    // 1% fee (basis points)
    uint256 public constant MIN_AUCTION_DURATION = 7 days;
    uint256 public constant MIN_BID_INCREMENT = 7 * 10**18; // 7 TSKJ tokens

    // ============ State Variables ============

    CompanyNFT public companyNFT;       // NFT contract reference
    PlatformToken public platformToken; // Token contract reference
    
    // Mappings for listings and bids
    mapping(uint256 => Listing) public listings;                          // tokenId => Listing
    mapping(uint256 => mapping(address => uint256)) public pendingReturns; // tokenId => bidder => amount
    
    // ============ Events ============

    event TokenListed(uint256 indexed tokenId, address indexed seller, uint256 price, bool isAuction);
    event TokenSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event AuctionBid(uint256 indexed tokenId, address indexed bidder, uint256 bid);
    event ListingCancelled(uint256 indexed tokenId);
    event AuctionEnded(uint256 indexed tokenId, address winner, uint256 amount);

    /**
     * @dev Initialize the Marketplace contract
     * @param _companyNFT Address of the CompanyNFT contract
     * @param _platformToken Address of the PlatformToken contract
     */
    constructor(address _companyNFT, address _platformToken) {
        require(_companyNFT != address(0), "Invalid NFT address");
        require(_platformToken != address(0), "Invalid token address");
        companyNFT = CompanyNFT(_companyNFT);
        platformToken = PlatformToken(_platformToken);
    }

    // ============ Listing Functions ============

    /**
     * @dev List an NFT for sale or auction
     * @param tokenId The ID of the NFT to list
     * @param price The fixed price or minimum bid for auction
     * @param isAuction Whether to list as auction
     */
    function listNFT(
        uint256 tokenId,
        uint256 price,
        bool isAuction
    ) external {
        require(companyNFT.ownerOf(tokenId) == msg.sender, "Not token owner");
        require(price > 0, "Price must be greater than 0");
        require(!listings[tokenId].active, "Already listed");

        // Transfer NFT to marketplace
        companyNFT.transferFrom(msg.sender, address(this), tokenId);
        
        // Create listing
        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            isAuction: isAuction,
            auctionEndTime: isAuction ? block.timestamp + MIN_AUCTION_DURATION : 0,
            highestBidder: address(0),
            highestBid: 0,
            active: true
        });

        emit TokenListed(tokenId, msg.sender, price, isAuction);
    }

    /**
     * @dev Buy a fixed-price listed NFT
     * @param tokenId The ID of the NFT to buy
     */
    function buyNFT(uint256 tokenId) external nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.active, "Not active listing");
        require(!listing.isAuction, "Is an auction");
        
        uint256 price = listing.price;
        address seller = listing.seller;
        
        // Transfer payment from buyer
        require(platformToken.transferFrom(msg.sender, address(this), price), "Transfer failed");
        
        // Calculate and distribute fees
        uint256 marketplaceFee = (price * MARKETPLACE_FEE) / 10000;
        uint256 sellerAmount = price - marketplaceFee;
        
        require(platformToken.transfer(owner(), marketplaceFee), "Fee transfer failed");
        require(platformToken.transfer(seller, sellerAmount), "Seller transfer failed");
        
        // Transfer NFT to buyer
        companyNFT.transferFrom(address(this), msg.sender, tokenId);
        
        // Clean up listing
        delete listings[tokenId];
        
        emit TokenSold(tokenId, seller, msg.sender, price);
    }

    // ============ Auction Functions ============

    /**
     * @dev Place a bid on an active auction
     * @param tokenId The ID of the NFT to bid on
     * @param bid The bid amount in TSKJ tokens
     */
    function placeBid(uint256 tokenId, uint256 bid) external nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.active && listing.isAuction, "Not an active auction");
        require(block.timestamp < listing.auctionEndTime, "Auction ended");
        
        // Validate bid amount
        require(bid >= listing.price, "Bid too low");
        require(bid >= listing.highestBid + MIN_BID_INCREMENT, "Bid increment too low");

        // Store previous bid for withdrawal
        if (listing.highestBidder != address(0)) {
            pendingReturns[tokenId][listing.highestBidder] = listing.highestBid;
        }

        // Transfer new bid
        require(platformToken.transferFrom(msg.sender, address(this), bid), "Token transfer failed");

        // Update auction state
        listing.highestBidder = msg.sender;
        listing.highestBid = bid;

        emit AuctionBid(tokenId, msg.sender, bid);
    }

    /**
     * @dev End an auction after its duration
     * @param tokenId The ID of the NFT being auctioned
     */
    function endAuction(uint256 tokenId) external nonReentrant {
        Listing storage listing = listings[tokenId];
        require(listing.active && listing.isAuction, "Not an active auction");
        require(block.timestamp >= listing.auctionEndTime, "Auction not ended");

        address winner = listing.highestBidder;
        uint256 amount = listing.highestBid;

        if (winner != address(0)) {
            // Calculate and distribute fees
            uint256 marketplaceFee = (amount * MARKETPLACE_FEE) / 10000;
            uint256 sellerAmount = amount - marketplaceFee;
            
            require(platformToken.transfer(owner(), marketplaceFee), "Fee transfer failed");
            require(platformToken.transfer(listing.seller, sellerAmount), "Seller transfer failed");
            
            // Transfer NFT to winner
            companyNFT.transferFrom(address(this), winner, tokenId);
        } else {
            // No bids, return NFT to seller
            companyNFT.transferFrom(address(this), listing.seller, tokenId);
        }

        emit AuctionEnded(tokenId, winner, amount);
        delete listings[tokenId];
    }

    /**
     * @dev Withdraw a previous bid that was outbid
     * @param tokenId The ID of the NFT the bid was placed on
     */
    function withdrawBid(uint256 tokenId) external nonReentrant {
        uint256 amount = pendingReturns[tokenId][msg.sender];
        require(amount > 0, "No funds to withdraw");

        // Clear pending return before transfer
        pendingReturns[tokenId][msg.sender] = 0;
        require(platformToken.transfer(msg.sender, amount), "Token transfer failed");
    }

    // ============ Management Functions ============

    /**
     * @dev Cancel an active listing
     * @param tokenId The ID of the NFT to cancel listing for
     */
    function cancelListing(uint256 tokenId) external {
        Listing storage listing = listings[tokenId];
        require(listing.active, "Not active listing");
        require(msg.sender == listing.seller || msg.sender == owner(), "Not authorized");
        require(!listing.isAuction || listing.highestBidder == address(0), "Has bids");

        // Return NFT to seller
        companyNFT.transferFrom(address(this), listing.seller, tokenId);
        delete listings[tokenId];

        emit ListingCancelled(tokenId);
    }

    // ============ View Functions ============

    /**
     * @dev Get detailed information about a listing
     * @param tokenId The ID of the NFT
     * @return seller Address of the seller
     * @return price Fixed price or minimum bid
     * @return isAuction Whether it's an auction
     * @return auctionEndTime End time for auction
     * @return highestBidder Current highest bidder
     * @return highestBid Current highest bid
     * @return active Whether listing is active
     */
    function getListing(uint256 tokenId) external view returns (
        address seller,
        uint256 price,
        bool isAuction,
        uint256 auctionEndTime,
        address highestBidder,
        uint256 highestBid,
        bool active
    ) {
        Listing storage listing = listings[tokenId];
        return (
            listing.seller,
            listing.price,
            listing.isAuction,
            listing.auctionEndTime,
            listing.highestBidder,
            listing.highestBid,
            listing.active
        );
    }
}
