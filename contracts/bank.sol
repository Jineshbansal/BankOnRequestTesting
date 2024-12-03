// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);
}

interface IERC20FeeProxy {
    function transferFromWithReferenceAndFee(
        address _tokenAddress,
        address _to,
        uint256 _amount,
        bytes calldata _paymentReference,
        uint256 _feeAmount,
        address _feeAddress
    ) external;

    function safeTransferFrom(
        address _tokenAddress,
        address _to,
        uint256 _amount
    ) external returns (bool);
}

contract Bank {
    event PaymentReceived(address indexed from, uint256 amount);
    event TokensApproved(address indexed token, address indexed spender, uint256 amount);
    event TransferWithFeeExecuted(
        address indexed proxy,
        address indexed token,
        address indexed recipient,
        uint256 amount,
        uint256 feeAmount,
        address feeRecipient
    );

    // The `receive` function is called when the contract receives Ether without data
    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }

    // The `fallback` function is called when the contract receives Ether with data or no matching function exists
    fallback() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }

    // Approve IERC20FeeProxy contract to spend tokens
    function approveTokens(address tokenAddress, address proxyAddress, uint256 amount) internal {
        require(tokenAddress != address(0), "Invalid token address");
        require(proxyAddress != address(0), "Invalid proxy address");
        require(amount > 0, "Approval amount must be greater than 0");

        // Interact with the ERC20 token contract
        IERC20 token = IERC20(tokenAddress);

        // Approve the proxy to spend tokens
        bool success = token.approve(proxyAddress, amount);
        require(success, "Token approval failed");

        emit TokensApproved(tokenAddress, proxyAddress, amount);
    }

    // Function to call transferFromWithReferenceAndFee on the IERC20FeeProxy
    function callTransferWithFee(
        address proxyAddress,
        address tokenAddress,
        address recipient,
        uint256 amount,
        bytes calldata paymentReference,
        uint256 feeAmount,
        address feeRecipient
    ) external {
        require(proxyAddress != address(0), "Invalid proxy address");
        require(tokenAddress != address(0), "Invalid token address");
        require(recipient != address(0), "Invalid recipient address");
        require(feeRecipient != address(0), "Invalid fee recipient address");
        require(amount > 0, "Amount must be greater than 0");
        require(feeAmount >= 0, "Fee amount must not be negative");

        // Verify approval
        IERC20 token = IERC20(tokenAddress);
        approveTokens(tokenAddress,proxyAddress,100000);
        uint256 allowance = token.allowance(address(this), proxyAddress);
        require(allowance >= amount + feeAmount, "Not enough tokens approved for transfer");

        // Create an instance of the ERC20FeeProxy contract
        IERC20FeeProxy proxy = IERC20FeeProxy(proxyAddress);

        // Call the function
        proxy.transferFromWithReferenceAndFee(
            tokenAddress,
            recipient,
            amount,
            paymentReference,
            feeAmount,
            feeRecipient
        );

        emit TransferWithFeeExecuted(proxyAddress, tokenAddress, recipient, amount, feeAmount, feeRecipient);
    }

    // Function to check the Ether balance of the contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
