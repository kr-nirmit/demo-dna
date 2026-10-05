'use client'

// import { MiniKit } from "@worldcoin/minikit-js";
import HomePage from '../components/HomePage';

import Link from "next/link";

const WORLD_CHAT_APP_ID = "app_e293fcd0565f45ca296aa317212d8741";

function getWorldChatDeeplinkUrl({
  username,
  message,
  pay,
  request,
}: {
  username: string;
  message?: string;
  pay?: string | number | boolean;
  request?: string | number | boolean;
}) {
  let path = `/${username}/draft`;
  console.log("🚀 ~ :19 ~ getWorldChatDeeplinkUrl ~ path:", path);

  if (message) {
    path += `?message=${message}`;
  } else if (pay !== undefined) {
    if (pay === "true" || pay === true) {
      path += `?pay`;
    } else {
      path += `?pay=${pay}`; // Pay with amount
    }
  } else if (request !== undefined) {
    if (request === "true" || request === true) {
      path += `?request`;
    } else {
      path += `?request=${request}`; // Request with amount
    }
  }

  const encodedPath = encodeURIComponent(path);
  const link = `https://worldcoin.org/mini-app?app_id=${WORLD_CHAT_APP_ID}&path=${encodedPath}`;
  console.log("🚀 ~ :38 ~ getWorldChatDeeplinkUrl ~ link:", link);
  return link;
}

// Create a chat with predefined message
// console.log(
//   getWorldChatDeeplinkUrl({
//     username: "johndoe",
//     message: "Hello from my mini app!",
//   })
// );

// // Create a chat with send payment option
// console.log(
//   getWorldChatDeeplinkUrl({
//     username: "johndoe",
//     pay: "true",
//   })
// );

// // Create a chat with send payment option and amount
// console.log(
//   getWorldChatDeeplinkUrl({
//     username: "johndoe",
//     pay: 5.25,
//   })
// );

// // Create a chat with payment request option
// console.log(
//   getWorldChatDeeplinkUrl({
//     username: "johndoe",
//     request: "true",
//   })
// );

// // Create a chat with payment request option and amount
// console.log(
//   getWorldChatDeeplinkUrl({
//     username: "johndoe",
//     request: 10,
//   })
// );

// const sendMessageLink = async () => {
//   const payload = await MiniKit.commandsAsync.
//   chat({
//     message: "hello",
//     to: ["0x2aaa0b124dc8af1d6948de0b7c50c127e980204e"]
//   });
// }

export default function Home() {
  return (
    <>
      <div>Home Page, Hello</div>
      <HomePage />
      <br />
      <br />
      <div style={{ fontSize: "20px", fontWeight: "bold", margin: "10px", padding: "10px", border: "2px solid black" }}>
        {/* <div onClick={() => getWorldChatDeeplinkUrl({
          username: "paradox.1111",
          message: "Hello from my mini app!",
        })}>Chat</div> */}
        <Link
          href={"https://world.org/profile?address=0x2aaa0b124dc8af1d6948de0b7c50c127e980204e&action=chat"}
          target="_blank"
        >
          Chat
        </Link>
      </div>
      <br />
      <div style={{ fontSize: "20px", fontWeight: "bold", margin: "10px", padding: "10px", border: "2px solid black" }}>
        <Link href="/signin">Sign in with World ID</Link>
      </div>
      <br />
      {/* <h1>
        <Link href="/wallet">Go to Wallet Page</Link>
      </h1> */}
    </>
  );
}
