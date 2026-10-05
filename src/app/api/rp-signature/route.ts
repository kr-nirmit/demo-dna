import { type NextRequest, NextResponse } from "next/server";
import { signRequest } from "@worldcoin/idkit/signing";

export async function POST(req: NextRequest) {
    try {
        const { action } = await req.json();

        if (!process.env.RP_SIGNING_KEY) {
            console.error("RP_SIGNING_KEY is not defined in environment variables");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const rpSignature = signRequest(
            action || "verify-human", // action
            // your private key
        );
        console.log("🚀 ~ POST ~ rpSignature:", rpSignature)

        // Send to frontend
        return NextResponse.json({
            rp_id: process.env.RP_ID || "rp_d92f88e28de5c36f", // your registered RP ID
            nonce: rpSignature.nonce, // auto-generated
            created_at: rpSignature.createdAt, // auto-generated
            expires_at: rpSignature.expiresAt, // auto-generated
            sig: rpSignature.sig, // returning sig to match frontend code
        });
    } catch (error) {
        console.error("Error signing request:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
