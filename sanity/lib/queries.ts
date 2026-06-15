import { defineQuery } from "next-sanity";

export const FEATURED_COURSES_QUERY = defineQuery(`*[
  _type == "course"
  && featured == true
] | order(_createdAt desc)[0...6] {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  category-> {
    _id,
    title
  },
  "moduleCount": count(modules),
  "lessonCount": count(modules[]->lessons[])
}`);

export const STATS_QUERY = defineQuery(`{
  "courseCount": count(*[_type == "course"]),
  "lessonCount": count(*[_type == "lesson"])
}`);

export const ADMIN_STATS_QUERY = defineQuery(`{
  "courseCount": count(*[_type == "course"]),
  "moduleCount": count(*[_type == "module"]),
  "lessonCount": count(*[_type == "lesson"]),
  "categoryCount": count(*[_type == "category"]),
  "recentCourses": *[_type == "course"] | order(_createdAt desc)[0...5] {
    _id,
    title,
    tier,
    _createdAt,
    "moduleCount": count(modules),
    "lessonCount": count(modules[]->lessons[])
  },
  "recentLessons": *[_type == "lesson"] | order(_createdAt desc)[0...5] {
    _id,
    title,
    _createdAt
  }
}`);

export const ADMIN_COURSES_QUERY = defineQuery(`*[_type == "course"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  tier,
  featured,
  _createdAt,
  _updatedAt,
  category-> {
    _id,
    title
  },
  "moduleCount": count(modules),
  "lessonCount": count(modules[]->lessons[])
}`);

export const ADMIN_MODULES_QUERY = defineQuery(`*[_type == "module"] | order(_createdAt desc) {
  _id,
  title,
  description,
  _createdAt,
  "lessonCount": count(lessons),
  lessons[]-> {
    _id,
    title
  }
}`);

export const ADMIN_LESSONS_QUERY = defineQuery(`*[_type == "lesson"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  description,
  videoUrl,
  demoVideoUrl,
  durationSeconds,
  _createdAt,
  "completionCount": count(completedBy),
  "module": *[_type == "module" && ^._id in lessons[]._ref][0] {
    _id,
    title
  }
}`);

export const ALL_MODULES_SIMPLE_QUERY = defineQuery(`*[_type == "module"] | order(title asc) {
  _id,
  title
}`);

export const ALL_LESSONS_WITH_MODULE_QUERY = defineQuery(`*[_type == "lesson"] | order(title asc) {
  _id,
  title,
  videoUrl,
  demoVideoUrl,
  "currentModule": *[_type == "module" && ^._id in lessons[]._ref][0] {
    _id,
    title
  }
}`);

export const ADMIN_CATEGORIES_QUERY = defineQuery(`*[_type == "category"] | order(title asc) {
  _id,
  title,
  description,
  icon,
  "courseCount": count(*[_type == "course" && references(^._id)])
}`);

export const USER_COURSES_QUERY = defineQuery(`*[
  _type == "course"
] | order(_createdAt desc) {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  completedBy,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  category-> {
    _id,
    title
  },
  modules[]-> {
    lessons[]-> {
      completedBy
    }
  },
  "moduleCount": count(modules),
  "lessonCount": count(modules[]->lessons[])
}`);

export const COURSE_WITH_MODULES_QUERY = defineQuery(`*[
  _type == "course"
  && slug.current == $slug
][0] {
  _id,
  title,
  slug,
  description,
  tier,
  featured,
  thumbnail {
    asset-> {
      _id,
      url
    }
  },
  category-> {
    _id,
    title
  },
  modules[]-> {
    _id,
    title,
    description,
    completedBy,
    lessons[]-> {
      _id,
      title,
      slug,
      description,
      videoUrl,
      demoVideoUrl,
      durationSeconds,
      completedBy,
      video {
        asset-> {
          playbackId,
          status,
          data {
            duration
          }
        }
      }
    }
  },
  completedBy,
  "moduleCount": count(modules),
  "lessonCount": count(modules[]->lessons[])
}`);

export const GET_USER_BY_CLERK_ID_QUERY = defineQuery(`*[
  _type == "user"
  && clerkId == $clerkId
][0] {
  _id,
  clerkId,
  email,
  name,
  imageUrl,
  plan,
  subscriptionStatus,
  subscriptionId,
  planUpdatedAt
}`);

export const LESSON_BY_SLUG_QUERY = defineQuery(`*[
  _type == "lesson"
  && slug.current == $slug
][0] {
  _id,
  title,
  slug,
  description,
  videoUrl,
  demoVideoUrl,
  durationSeconds,
  video {
    asset-> {
      playbackId,
      status,
      data {
        duration
      }
    }
  },
  content,
  completedBy,
  "courses": *[_type == "course" && ^._id in modules[]->lessons[]->_id] | order(
    select(tier == "free" => 0, tier == "pro" => 1, tier == "ultra" => 2)
  ) {
    _id,
    title,
    slug,
    tier,
    modules[]-> {
      _id,
      title,
      lessons[]-> {
        _id,
        title,
        slug,
        videoUrl,
        demoVideoUrl,
        durationSeconds,
        completedBy
      }
    }
  }
}`);