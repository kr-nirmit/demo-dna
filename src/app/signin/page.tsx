"use client";

import { useMemo, useState, type ReactElement } from "react";
import {
    IDKit,
    documentLegacy,
    selfieCheckLegacy,
    IDKitRequestWidget,
    orbLegacy,
    secureDocumentLegacy,
    type IDKitResult,
    type RpContext,
} from "@worldcoin/idkit";

const APP_ID =
    process.env.NEXT_PUBLIC_APP_ID || "app_d78be78c05d501e92e3273334cf784bc";
const RP_ID = process.env.NEXT_PUBLIC_RP_ID || "rp_d92f88e28de5c36f";

type PresetKind = "orb" | "secure_document" | "document" | "selfie";

function createPreset(kind: PresetKind, signal: string) {
    switch (kind) {
        case "orb":
            return orbLegacy({ signal });
        case "secure_document":
            return secureDocumentLegacy({ signal });
        case "document":
            return documentLegacy({ signal });
        case "selfie":
            return selfieCheckLegacy({ signal });
        default: {
            const exhaustive: never = kind;
            throw new Error(`Unsupported preset: ${String(exhaustive)}`);
        }
    }
}

async function fetchRpContext(action: string): Promise<RpContext> {
    const response = await fetch("/api/rp-signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
    });

    if (!response.ok) {
        const payload = await response.json();
        throw new Error(payload.error ?? "Failed to fetch RP signature");
    }

    const data = (await response.json()) as {
        sig: string;
        nonce: string;
        created_at: number;
        expires_at: number;
    };

    if (!RP_ID) {
        throw new Error("Missing NEXT_PUBLIC_RP_ID");
    }

    console.log(data);
    const temp = {
        rp_id: RP_ID,
        nonce: data.nonce,
        created_at: data.created_at,
        expires_at: data.expires_at,
        signature: data.sig,
    }
    console.log("🚀 ~ fetchRpContext ~ temp:", temp)

    return {
        rp_id: RP_ID,
        nonce: data.nonce,
        created_at: data.created_at,
        expires_at: data.expires_at,
        signature: data.sig,
    };
}

async function verifyProof(payload: IDKitResult): Promise<unknown> {
    if (!RP_ID) {
        throw new Error("Missing NEXT_PUBLIC_RP_ID");
    }

    const response = await fetch("/api/verify-proof", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ rp_id: RP_ID, devPortalPayload: payload }),
    });

    const json = await response.json();
    if (!response.ok) {
        throw new Error(json.error ?? "Verification failed");
    }

    return json;
}

export default function SigninPage(): ReactElement {
    const [widgetOpen, setWidgetOpen] = useState(false);
    const [widgetRpContext, setWidgetRpContext] = useState<RpContext | null>(
        null
    );
    const [widgetError, setWidgetError] = useState<string | null>(null);
    const [widgetVerifyResult, setWidgetVerifyResult] = useState<unknown>(null);
    const [widgetPresetKind, setWidgetPresetKind] = useState<PresetKind>("orb");
    const [widgetSignal, setWidgetSignal] = useState("demo-signal-initial");
    const [action, setAction] = useState("dna-test-40");
    const [environment, setEnvironment] = useState<"production" | "staging">(
        "production"
    );

    const widgetPreset = useMemo(
        () => createPreset(widgetPresetKind, widgetSignal),
        [widgetPresetKind, widgetSignal]
    );

    const startWidgetFlow = async (presetKind: PresetKind) => {
        setWidgetError(null);
        setWidgetVerifyResult(null);

        try {
            const rpContext = await fetchRpContext(action || "test-action");
            setWidgetPresetKind(presetKind);
            setWidgetSignal(`demo-signal-${Date.now()}`);
            setWidgetRpContext(rpContext);
            setWidgetOpen(true);
        } catch (error) {
            setWidgetError(error instanceof Error ? error.message : "Unknown error");
        }
    };

    const startMiniAppFlow = async () => {
        setWidgetError(null);
        setWidgetVerifyResult(null);

        try {
            // 1. Fetch RP Context
            const rpContext = await fetchRpContext(action || "test-action");
            console.log("Mini App rpContext", rpContext);

            // orbLegacy, secureDocumentLegacy, documentLegacy, selfieCheckLegacy

            // 2. Request verification
            const request = await IDKit.request({
                app_id: APP_ID as `app_${string}`,
                action: action,
                rp_context: rpContext,
                allow_legacy_proofs: true,
                environment: environment,
            }).preset(selfieCheckLegacy({ signal: `demo-signal-${Date.now()}` }));
            console.log("🚀 ~ startMiniAppFlow ~ request:", request)

            const completion = await request.pollUntilCompletion();
            console.log("Mini App completion", completion);

            // 3. Verify Proof
            if (completion.success && completion.result) {
                const verified = await verifyProof(completion.result as IDKitResult);
                setWidgetVerifyResult(verified);
            } else {
                setWidgetError("MiniApp verification failed or was cancelled.");
            }
        } catch (error) {
            setWidgetError(error instanceof Error ? error.message : "Unknown error");
        }
    };

    if (!APP_ID || !RP_ID) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <section className="p-8 bg-white border border-red-200 rounded-xl shadow-lg max-w-md w-full text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-4">
                        Missing environment configuration
                    </h2>
                    <p className="text-gray-600">
                        Set{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                            NEXT_PUBLIC_APP_ID
                        </code>{" "}
                        and{" "}
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                            NEXT_PUBLIC_RP_ID
                        </code>{" "}
                        in <code>.env.local</code>.
                    </p>
                </section>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Verify with World ID
                    </h1>
                    <p className="mt-3 text-lg text-gray-500">
                        Secure, human verification test client.
                    </p>
                </div>

                <section className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label
                                htmlFor="cfgAppId"
                                className="block text-sm font-medium text-gray-700"
                            >
                                App ID
                            </label>
                            <input
                                type="text"
                                id="cfgAppId"
                                value={APP_ID}
                                readOnly
                                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm focus:ring-black focus:border-black sm:text-sm font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <label
                                htmlFor="cfgRpId"
                                className="block text-sm font-medium text-gray-700"
                            >
                                RP ID
                            </label>
                            <input
                                type="text"
                                id="cfgRpId"
                                value={RP_ID}
                                readOnly
                                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 text-sm focus:ring-black focus:border-black sm:text-sm font-mono"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label
                                htmlFor="cfgAction"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Action
                            </label>
                            <input
                                type="text"
                                id="cfgAction"
                                value={action}
                                onChange={(e) => setAction(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm transition-all"
                                placeholder="Action string (e.g. test-action)"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <label
                                htmlFor="cfgEnv"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Environment
                            </label>
                            <div className="relative">
                                <select
                                    id="cfgEnv"
                                    value={environment}
                                    onChange={(e) =>
                                        setEnvironment(e.target.value as "production" | "staging")
                                    }
                                    className="block w-full pl-4 pr-10 py-3 text-base border-gray-300 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-black sm:text-sm appearance-none bg-white shadow-sm transition-all text-gray-900"
                                >
                                    <option value="production">Production</option>
                                    <option value="staging">Staging</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                    <svg
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => startWidgetFlow("orb")}
                            className="group relative flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                        >
                            Verify with Orb
                        </button>
                        <button
                            onClick={() => startWidgetFlow("secure_document")}
                            className="group relative flex justify-center py-4 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black shadow-sm transition-all duration-200 hover:border-gray-400"
                        >
                            Verify with Secure Document
                        </button>
                        <button
                            onClick={() => startWidgetFlow("document")}
                            className="group relative flex justify-center py-4 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black shadow-sm transition-all duration-200 hover:border-gray-400"
                        >
                            Verify with Document
                        </button>
                        <button
                            onClick={() => startWidgetFlow("selfie")}
                            className="group relative flex justify-center py-4 px-4 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black shadow-sm transition-all duration-200 hover:border-gray-400"
                        >
                            Verify with Selfie Check
                        </button>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
                        Mini App Integration
                    </h2>
                    <div className="flex justify-center">
                        <button
                            onClick={startMiniAppFlow}
                            className="group relative w-full sm:w-1/2 flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                        >
                            Verify as MiniApp
                        </button>
                    </div>
                </div>

                {widgetError && (
                    <div className="rounded-xl bg-red-50 p-4 border border-red-100 animate-in fade-in zoom-in duration-300">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-red-400"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>{widgetError}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {widgetRpContext && (
                    <IDKitRequestWidget
                        open={widgetOpen}
                        onOpenChange={setWidgetOpen}
                        app_id={APP_ID as `app_${string}`}
                        action={action || "test-action"}
                        rp_context={widgetRpContext}
                        allow_legacy_proofs={true}
                        preset={widgetPreset}
                        onSuccess={async (result) => {
                            try {
                                const verified = await verifyProof(result);
                                setWidgetVerifyResult(verified);
                            } catch (error) {
                                setWidgetError(
                                    "Failed to verify proof: " +
                                    (error instanceof Error ? error.message : "Unknown error")
                                );
                            }
                        }}
                        onError={(errorCode) => {
                            setWidgetError(`Verification failed: ${errorCode}`);
                        }}
                        environment={environment}
                    />
                )}

                {!!widgetVerifyResult && (
                    <div className="rounded-xl bg-green-50 p-6 border border-green-200 shadow-inner animate-in slide-in-from-bottom-4 duration-500 overflow-hidden">
                        <div className="flex items-center mb-4">
                            <svg
                                className="h-6 w-6 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="text-lg font-medium text-green-900">
                                Verification Successful
                            </h3>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-green-100 overflow-x-auto">
                            <pre className="text-xs text-green-800 break-words whitespace-pre-wrap">
                                {JSON.stringify(widgetVerifyResult, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
