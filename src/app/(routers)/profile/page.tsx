import { PROFILE_TEXT } from '@/app/(routers)/profile/constants';

import ProfileContainer from './_components/ProfileContainer';

export default function ProfilePage() {
  return (
    <div className="my-auto h-fit w-[343px] space-y-[22px] py-4 md:w-157 lg:w-140 lg:space-y-10">
      <h1 className="font-xl-semibold hidden md:flex">{PROFILE_TEXT.TITLE}</h1>
      <ProfileContainer />
    </div>
  );
}
