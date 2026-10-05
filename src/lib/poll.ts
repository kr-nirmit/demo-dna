// "use server";

// import { wagmiAdapter } from "@/app/lib/web3/wagmi";
// import { waitForTransactionReceipt } from "@wagmi/core";
// import axios from "axios";

// import { env } from "@formbricks/lib/env";

// interface TransactionResult {
//   status: "success" | "failed";
//   transactionHash?: string;
// }

// const pollingInterval = 4000; // 4 seconds

// const apiKey = env.NEXT_PUBLIC_WORLDCOIN_API_KEY;

// export async function fetchMiniAppTransactionReceipt(transactionId: string) {
//   try {
//     const response = await axios.get(
//       `https://developer.worldcoin.org/api/v2/minikit/transaction/${transactionId}?app_id=${env.NEXT_PUBLIC_WORLDCOIN_APP_ID}&type=transaction`,
//       {
//         headers: {
//           Authorization: Bearer ${apiKey},
//         },
//       }
//     );
//     return response?.data;
//   } catch (error: any) {
//     console.error(Error: Failed to fetch transaction receipt for transactionId: ${transactionId}, error);
//     return { status: "failed", message: "error_occurred" };
//   }
// }

// export const pollHash = async (transaction_id: string, retries: number): Promise<TransactionResult> => {
//   if (retries == 0) {
//     return {
//       status: "failed",
//     };
//   }

//   try {
//     const data = await fetchMiniAppTransactionReceipt(transaction_id);

//     if (data.transactionHash) {
//       const result = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
//         hash: data.transactionHash,
//         timeout: 1800000,
//         retryDelay: 2000,
//         retryCount: 3600,
//         chainId: 480,
//       });
//       if (result.status === "success") {
//         return {
//           status: "success",
//           transactionHash: data.transactionHash,
//         };
//       } else {
//         return {
//           status: "failed",
//           transactionHash: data.transactionHash,
//         };
//       }
//     }
//   } catch (err) {
//     console.error("~ pollHash error:", err);
//   }

//   // Wait for the polling interval before retrying
//   await new Promise((resolve) => setTimeout(resolve, pollingInterval));
//   return pollHash(transaction_id, retries - 1);
// };

