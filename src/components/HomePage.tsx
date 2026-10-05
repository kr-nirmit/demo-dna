"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [minikitInstalled, setMiniKitInstalled] = useState(false);
  const [minikitWalletAddress, setMiniKitWalletAddress] = useState("");

  const signInWithWallet = async () => {
    if (!MiniKit.isInstalled()) {
      return;
    }

    await MiniKit.commandsAsync.walletAuth({
      nonce: "hello123456",
      expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
      notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      statement: "This is my statement",
    });

    setMiniKitWalletAddress(MiniKit?.walletAddress ?? "");
  };

  useEffect(() => {
    const minikitInstall = async () => {
      await MiniKit.install();
    };
    setMiniKitInstalled(MiniKit.isInstalled());
    minikitInstall();
  }, []);

  const getNFT = async () => {
    const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
      transaction: [
        {
          address: "0x48813ff38a2e36dbe9a1dfaafebd1fd793e3795c",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "transferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          functionName: "transferFrom",
          args: [
            "0x61604dbfe4c3b72b3896490a29a471b2014d12c1",
            "0x52F87CA3667b4597Ae09f5e28aeeBcB57851dba2",
            "0x245B",
          ],
        },
        {
          address: "0x8fc4029942f159ee462a28c8e573f680f686d417",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "from",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "tokenId",
                  type: "uint256",
                },
              ],
              name: "transferFrom",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          functionName: "transferFrom",
          args: [
            "0x61604dbfe4c3b72b3896490a29a471b2014d12c1",
            "0x52F87CA3667b4597Ae09f5e28aeeBcB57851dba2",
            "0x134D",
          ],
        },
      ],
    });
    console.log(
      "🚀 ~ :225 ~ MinikitNavbar ~ getNFT ~ finalPayload:",
      finalPayload
    );
  };

  const ethPay = async () => {
    const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
      transaction: [
        {
          address: "0x087d5449a126e4e439495fcBc62A853eB3257936",
          abi: [
            {
              inputs: [
                {
                  internalType: "address payable",
                  name: "recipient",
                  type: "address",
                },
              ],
              name: "pay",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
          ],
          functionName: "pay",
          args: ["0x61604dbfe4c3b72b3896490a29a471b2014d12c1"],
          value: "0x" + Number(1).toString(16),
        },
        {
          address: "0x087d5449a126e4e439495fcBc62A853eB3257936",
          abi: [
            {
              inputs: [
                {
                  internalType: "address payable",
                  name: "recipient",
                  type: "address",
                },
              ],
              name: "pay",
              outputs: [],
              stateMutability: "payable",
              type: "function",
            },
          ],
          functionName: "pay",
          args: ["0x4a9efddd218bc63f9e5b9eb05a98e195c5c53872"],
          value: "0x" + Number(10).toString(16),
        },
      ],
    });
    console.log("🚀 ~ :139 ~ ethPay ~ finalPayload:", finalPayload);
  };

  const tokenPay = async () => {
    const transferAmount = 1000000000000000000;
    const { finalPayload } = await MiniKit.commandsAsync.sendTransaction({
      transaction: [
        {
          address: "0xED49fE44fD4249A09843C2Ba4bba7e50BECa7113",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "to",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "amount",
                  type: "uint256",
                },
              ],
              name: "transfer",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          functionName: "transfer",
          args: [
            "0x52F87CA3667b4597Ae09f5e28aeeBcB57851dba2",
            transferAmount.toString()
          ],
        },
      ],
    });
    console.log("🚀 ~ :179 ~ tokenPay ~ finalPayload:", finalPayload);
  };

  return (
    <>
      <h1>{`Minikit.isInstalled:  ${minikitInstalled}`}</h1>
      <button className="bg-orange-500 p-4" onClick={signInWithWallet}>
        WalletAuth
      </button>
      <div className="text-black mt-3">{`User Wallet: ${minikitWalletAddress}`}</div>
      <Link
        className="bg-orange-300 p-4"
        href={`https://worldcoin.org/mini-app?app_id=app_01720ad1b5731a5f8586378435798fb0&path=/discover?minikitaddress=${minikitWalletAddress}`}
      >
        <a className="btn">DNA NFT</a>
      </Link>

      <button className="bg-orange-500 p-4" onClick={getNFT}>
        getNFT
      </button>
      <br />
      <br />
      <button className="bg-orange-500 p-4" onClick={ethPay}>
        ETH Pay
      </button>
      <br />
      <br />
      <button className="bg-orange-500 p-4" onClick={tokenPay}>
        DNA Pay
      </button>
      <br />
      <br />
      <h2>Upload Image</h2>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/jpg,image/png,image/gif"
        className="test-input"
      />
    </>
  );
}
