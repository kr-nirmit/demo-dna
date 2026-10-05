"use client";

import Link from "next/link";

const app_id = "app_7eb5b3f4e82891e543888a2d08a83fa8";
// const app_id = "app_758aaf707b85d22721a2c5c0576f5fb5";

function getDeepLinkUrl(appId: string, path?: string) {
  if (path) {
    const encodedPath = encodeURIComponent(path);
    // const encodedPath = path;

    return `https://worldcoin.org/mini-app?app_id=${appId}&path=${encodedPath}`;
  } else {
    return `https://worldcoin.org/mini-app?app_id=${appId}`;
  }
}
export default function Home() {
  const link1 = getDeepLinkUrl(app_id);

  const link11 = getDeepLinkUrl(app_id,  "/");

  const link2 = getDeepLinkUrl(app_id, "?tab=send");

  const link3 = getDeepLinkUrl(app_id, "/?tab=swap");

  return (
    <div className="flex m-10 justify-center items-center flex-col">
      <h1 className="text-3xl font-bold underline">Wallet Home Page</h1>
      <br />
      <br />
      <Link href={link1}>Only AppID</Link>
      <br />
      <br />
      <Link href={link11}>Wallet Page</Link>

      <br />
      <br />
      <Link href={link2}>Wallet Send Tab</Link>

      <br />
      <br />
      <Link href={link3}>Wallet Swap Tab</Link>
    </div>
  );
}