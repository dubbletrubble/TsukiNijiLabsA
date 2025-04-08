// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CompanyNFT
 * @dev NFT contract representing company ownership with revenue tracking
 * 
 * This contract handles:
 * 1. Minting of company NFTs with unique company IDs
 * 2. Tracking company revenue and profit data
 * 3. Restricted transfers through marketplace only
 * 4. URI management for token metadata
 */
contract CompanyNFT is ERC721Enumerable, Ownable {
    using Counters for Counters.Counter;

    // ============ Structs ============

    struct CompanyData {
        uint256 companyId;      // Unique identifier for the company
        address currentOwner;   // Current owner of the company NFT
        uint256 monthlyRevenue; // Monthly revenue in base currency
        uint256 monthlyProfit;  // Monthly profit in base currency
        bool exists;            // Whether the company data exists
    }

    // ============ State Variables ============

    Counters.Counter private _tokenIds;                    // Counter for token IDs
    mapping(uint256 => CompanyData) public companies;      // Token ID to company data
    mapping(uint256 => string) private _tokenURIs;        // Token ID to metadata URI
    mapping(uint256 => bool) public companyIdUsed;        // Track used company IDs
    address public marketplaceAddress;                    // Authorized marketplace

    // ============ Events ============

    event CompanyNFTMinted(uint256 indexed tokenId, uint256 indexed companyId, address owner);
    event CompanyDataUpdated(uint256 indexed tokenId, uint256 monthlyRevenue, uint256 monthlyProfit);
    event MarketplaceAddressUpdated(address indexed newMarketplace);

    /**
     * @dev Initialize the CompanyNFT contract
     */
    constructor() ERC721("CompanyNFT", "CNFT") {}

    // ============ Admin Functions ============

    /**
     * @dev Set the authorized marketplace address
     * @param _marketplace Address of the marketplace contract
     */
    function setMarketplaceAddress(address _marketplace) external onlyOwner {
        require(_marketplace != address(0), "Invalid marketplace address");
        marketplaceAddress = _marketplace;
        emit MarketplaceAddressUpdated(_marketplace);
    }

    /**
     * @dev Mint a new company NFT
     * @param to Address to mint the NFT to
     * @param companyId Unique identifier for the company
     * @param tokenURI_ Metadata URI for the token
     * @return The ID of the newly minted token
     */
    function mintCompanyNFT(
        address to,
        uint256 companyId,
        string memory tokenURI_
    ) external onlyOwner returns (uint256) {
        require(!companyIdUsed[companyId], "Company ID already used");
        
        // Mint new token
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI_);
        
        // Initialize company data
        companies[newTokenId] = CompanyData({
            companyId: companyId,
            currentOwner: to,
            monthlyRevenue: 0,
            monthlyProfit: 0,
            exists: true
        });
        
        companyIdUsed[companyId] = true;
        emit CompanyNFTMinted(newTokenId, companyId, to);
        return newTokenId;
    }

    /**
     * @dev Update a company's revenue and profit data
     * @param tokenId The ID of the token to update
     * @param _monthlyRevenue New monthly revenue value
     * @param _monthlyProfit New monthly profit value
     */
    function updateCompanyData(
        uint256 tokenId,
        uint256 _monthlyRevenue,
        uint256 _monthlyProfit
    ) external onlyOwner {
        require(companies[tokenId].exists, "Company does not exist");
        
        companies[tokenId].monthlyRevenue = _monthlyRevenue;
        companies[tokenId].monthlyProfit = _monthlyProfit;
        
        emit CompanyDataUpdated(tokenId, _monthlyRevenue, _monthlyProfit);
    }

    // ============ URI Management ============

    /**
     * @dev Internal function to set the token URI
     * @param tokenId The ID of the token
     * @param _tokenURI The URI to set
     */
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    /**
     * @dev Get the metadata URI for a token
     * @param tokenId The ID of the token
     * @return The token's metadata URI
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "URI query for nonexistent token");
        return _tokenURIs[tokenId];
    }

    // ============ Transfer Management ============

    /**
     * @dev Hook that is called before any token transfer
     * @param from Address sending the token (address(0) for minting)
     * @param to Address receiving the token
     * @param tokenId The ID of the token being transferred
     * @param batchSize Size of the batch being transferred
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        
        // Only allow transfers through the marketplace or minting
        require(
            from == address(0) || // Minting
            msg.sender == marketplaceAddress, // Marketplace transfer
            "Transfers only allowed through marketplace"
        );

        // Update company owner on transfer (not on mint)
        if (from != address(0)) {
            companies[tokenId].currentOwner = to;
        }
    }
}
