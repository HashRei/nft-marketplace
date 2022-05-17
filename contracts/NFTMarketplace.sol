// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721URIStorage {
    using Counters for Counters.Counter;

    /** VARIABLES **/
    Counters.Counter private tokenIds;
    Counters.Counter private itemsSold;

    uint256 listingPrice;
    address payable owner;

    mapping(uint256 => MarketItem) private idToMarketItem;

    /** STRUCTS **/
    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    /** EVENTS **/
    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    /** CONSTRUCTOR **/
    constructor() ERC721("LooksSea Tokens", "LSEAT") {
        listingPrice = 0.003 ether; // This unit is in MATIC tokens
        owner = payable(msg.sender);
    }

    /** MAIN METHODS **/

    // Updates the listing price of the contract
    function updateListingPrice(uint256 _listingPrice) public payable {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        listingPrice = _listingPrice;
    }

    // Returns the listing price of the contract
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    // Mints a token and lists it in the marketplace
    function createToken(string memory _tokenURI, uint256 _price)
        public
        payable
        returns (uint256)
    {
        tokenIds.increment();
        uint256 newTokenId = tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        createMarketItem(newTokenId, _price);
        return newTokenId;
    }

    function createMarketItem(uint256 _tokenId, uint256 _price) private {
        require(_price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        idToMarketItem[_tokenId] = MarketItem(
            _tokenId,
            payable(msg.sender),
            payable(address(this)), // This contract will be the owner
            _price,
            false
        );

        _transfer(msg.sender, address(this), _tokenId); // The token from msg.sender to this contract
        emit MarketItemCreated(
            _tokenId,
            msg.sender,
            address(this),
            _price,
            false
        );
    }

    // Creates the sale of a marketplace item
    // Transfers ownership of the item, as well as funds between parties
    function createMarketSale(uint256 _tokenId) public payable {
        uint256 price = idToMarketItem[_tokenId].price;
        address seller = idToMarketItem[_tokenId].seller;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );
        idToMarketItem[_tokenId].owner = payable(msg.sender); // Set new owner
        idToMarketItem[_tokenId].sold = true;
        idToMarketItem[_tokenId].seller = payable(address(0)); // TODO: Take care of setting address zero as seller
        itemsSold.increment();
        _transfer(address(this), msg.sender, _tokenId); // Transfer token to msg.sender, the new owner of it
        payable(owner).transfer(listingPrice); // Send listingPrice fee to the owner of this contract
        payable(seller).transfer(msg.value); // Send money to the seller
    }

    // Allows someone to resell a token they have purchased
    function resellToken(uint256 _tokenId, uint256 _price) public payable {
        require(
            idToMarketItem[_tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );
        idToMarketItem[_tokenId].sold = false;
        idToMarketItem[_tokenId].price = _price;
        idToMarketItem[_tokenId].seller = payable(msg.sender);
        idToMarketItem[_tokenId].owner = payable(address(this));
        itemsSold.decrement();

        _transfer(msg.sender, address(this), _tokenId);
    }

    // Returns all unsold market items
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = tokenIds.current();
        uint256 unsoldItemCount = tokenIds.current() - itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount); // Array of unsoldItems

        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(this)) {
                MarketItem storage currentItem = idToMarketItem[i + 1]; // i + 1 is the current ID
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // Returns only items that a user has purchased
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                MarketItem storage currentItem = idToMarketItem[i + 1]; // i + 1 is the current ID
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // Returns only items a user has listed
    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                MarketItem storage currentItem = idToMarketItem[i + 1];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
