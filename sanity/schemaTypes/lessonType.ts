import { PlayIcon, UserIcon, VideoIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const lessonType = defineType({
  name: "lesson",
  title: "Lesson",
  type: "document",
  icon: PlayIcon,
  groups: [
    { name: "content", title: "Content", icon: PlayIcon, default: true },
    { name: "video", title: "Video", icon: VideoIcon },
    { name: "settings", title: "Settings" },
    { name: "completion", title: "Completed By", icon: UserIcon },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (Rule) => [
        Rule.required().error("Lesson title is required"),
        Rule.max(100).warning("Keep lesson titles concise"),
      ],
    }),

    defineField({
      name: "slug",
      type: "slug",
      group: "settings",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => [
        Rule.required().error("Slug is required for URL generation"),
      ],
    }),

    defineField({
      name: "description",
      type: "text",
      group: "content",
      description: "Brief overview of what this lesson covers",
      validation: (Rule) => [
        Rule.max(500).warning("Keep descriptions under 500 characters"),
      ],
    }),

    defineField({
      title: "Mux Video File",
      name: "video",
      type: "mux.video",
      group: ["content", "video"],
      description:
        "Optional production video upload through Mux. YouTube URL below has priority for portfolio demo.",
    }),

    defineField({
      name: "videoUrl",
      title: "YouTube Video URL",
      type: "url",
      group: ["content", "video"],
      description:
        "Paste a YouTube video link here. Supports youtube.com/watch, youtu.be, /embed, and /shorts links.",
    }),

    defineField({
      name: "demoVideoUrl",
      title: "Fallback Demo Video URL",
      type: "url",
      group: ["content", "video"],
      description:
        "Optional fallback demo video. Supports local /videos/*.mp4, Vimeo, direct MP4/WebM, or YouTube.",
    }),

    defineField({
      name: "durationSeconds",
      title: "Duration Seconds",
      type: "number",
      group: ["content", "video"],
      description:
        "Fallback duration shown when no Mux duration exists.",
      validation: (Rule) => Rule.min(0).max(7200),
    }),

    defineField({
      name: "content",
      title: "Lesson Content",
      type: "array",
      group: "content",
      description: "Additional lesson content, notes, or resources",
      of: [
        defineArrayMember({
          type: "block",
        }),
        defineArrayMember({
          type: "image",
          fields: [
            defineField({
              name: "caption",
              type: "string",
              description: "Optional caption for the image",
            }),
            defineField({
              name: "alt",
              type: "string",
              description: "Alternative text for accessibility",
            }),
          ],
        }),
      ],
    }),

    defineField({
      name: "completedBy",
      type: "array",
      group: "completion",
      description: "List of user IDs who have completed this lesson",
      of: [defineArrayMember({ type: "string" })],
      readOnly: true,
    }),
  ],

  preview: {
    select: {
      title: "title",
      videoUrl: "videoUrl",
      demoVideoUrl: "demoVideoUrl",
    },
    prepare({ title, videoUrl, demoVideoUrl }) {
      return {
        title: title || "Untitled Lesson",
        subtitle: videoUrl
          ? "YouTube video attached"
          : demoVideoUrl
            ? "Demo video attached"
            : "No video URL",
        media: PlayIcon,
      };
    },
  },
});