import { defineField, defineType } from "sanity";

export const userType = defineType({
    name: "user",
    title: "User",
    type: "document",
    fields: [
        defineField({
            name: "clerkId",
            title: "Clerk User ID",
            type: "string",
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: "email",
            title: "Email",
            type: "string",
        }),
        defineField({
            name: "name",
            title: "Name",
            type: "string",
        }),
        defineField({
            name: "imageUrl",
            title: "Avatar URL",
            type: "url",
        }),
        defineField({
            name: "plan",
            title: "Current Plan",
            type: "string",
            options: {
                list: [
                    { value: "free", title: "Free" },
                    { value: "pro", title: "Pro" },
                    { value: "ultra", title: "Ultra" },
                ],
            },
            initialValue: "free",
        }),
        defineField({
            name: "subscriptionStatus",
            title: "Subscription Status",
            type: "string",
            options: {
                list: [
                    { value: "active", title: "Active" },
                    { value: "canceled", title: "Canceled" },
                    { value: "past_due", title: "Past Due" },
                    { value: "none", title: "None" },
                ],
            },
            initialValue: "none",
        }),
        defineField({
            name: "subscriptionId",
            title: "Subscription ID",
            type: "string",
        }),
        defineField({
            name: "planUpdatedAt",
            title: "Plan Last Updated",
            type: "datetime",
        }),
    ],
    preview: {
        select: {
            title: "name",
            subtitle: "email",
            plan: "plan",
        },
        prepare({ title, subtitle, plan }) {
            return {
                title: title || "Unnamed User",
                subtitle: `${subtitle || "no email"} · ${plan || "free"}`,
            };
        },
    },
});
