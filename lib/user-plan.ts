import { auth } from "@clerk/nextjs/server";
import { Tier } from "./constants";



export async function hasAccessToTier(
    requiredTier: Tier | null | undefined
): Promise<boolean> {
    // Free content or no tier = accessible to everyone
    if (!requiredTier || requiredTier === "free") return true;
    const { has } = await auth();

    console.log("requiredTier", requiredTier);
    console.log("has ultra", has({ plan: "ultra" }));
    console.log("has pro", has({ plan: "pro" }));
    console.log("has free_user", has({ plan: "free_user" }));

    // Ultra content requires ultra plan
    if (requiredTier === "ultra") {
        return has({ plan: "ultra" });
    }

    // Pro content requires pro OR ultra plan
    if (requiredTier === "pro") {
        return has({ plan: "pro" }) || has({ plan: "ultra" });
    }

    return false;
}


export async function getUserTier(): Promise<Tier> {
    const { has } = await auth();

    if (has({ plan: "ultra" })) return "ultra";
    if (has({ plan: "pro" })) return "pro";

    return "free";
}


