"use client";

import { MiniKit} from "@worldcoin/minikit-js";
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
    }
    setMiniKitInstalled(MiniKit.isInstalled());
    minikitInstall();
  }, []);


  return (
    <>
      <h1>{`Minikit.isInstalled:  ${minikitInstalled}`}</h1>
      <button className="bg-orange-500 p-4" onClick={signInWithWallet}>
        WalletAuth
      </button>
      <div className="text-black mt-3">{`User Wallet: ${minikitWalletAddress}`}</div>
      <Link className="bg-orange-300 p-4" href={`https://worldcoin.org/mini-app?app_id=app_01720ad1b5731a5f8586378435798fb0&path=/discover?minikitaddress=${minikitWalletAddress}`}>
        <a className="btn">DNA NFT</a>
      </Link>
    </>
  );
}

