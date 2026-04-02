import ProfileContainer from './_components/ProfileContainer';

export default function ProfilePage() {
  return (
    <div className="h-fit w-[343px] space-y-[22px] md:w-157 lg:w-140 lg:space-y-10">
      <h1 className="font-xl-semibold">내 정보 관리</h1>
      <ProfileContainer />
    </div>
  );
}
