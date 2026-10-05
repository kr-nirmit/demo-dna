import { NextResponse } from "next/server";
import type { IDKitResult } from "@worldcoin/idkit";

export async function POST(request: Request): Promise<Response> {
    const { rp_id, devPortalPayload } = (await request.json()) as {
        rp_id: string;
        devPortalPayload: IDKitResult;
    };
    console.log("rp_id", rp_id);
    console.log("devPortalPayload", devPortalPayload);

    const response = await fetch(
        `https://developer.world.org/api/v4/verify/${rp_id}`,
        {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(devPortalPayload),
        }
    );

    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
}
