import { sanityFetch } from '@/sanity/lib/live';
import { USER_COURSES_QUERY } from '@/sanity/lib/queries';
import { currentUser } from '@clerk/nextjs/server';
import React from 'react';
import { getUserTier } from '@/lib/user-plan';
import UserCourse from '../_components/UserCourse';

async function page() {
  const user = await currentUser();
  if (!user) return null;

  const [{ data: courses }, userTier] = await Promise.all([
    sanityFetch({
      query: USER_COURSES_QUERY,
      params: { userId: user.id },
    }),
    getUserTier(),
  ]);

  return (
    <div className="container mx-auto p-4 md:p-8 pt-6">
      <UserCourse courses={courses || []} userTier={userTier} />
    </div>
  );
}

export default page;
