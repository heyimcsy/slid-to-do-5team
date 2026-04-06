import Image from 'next/image';

import { FeatureCard } from './_components/FeatureCard';
import { StartButton } from './_components/StartButton';
import { STEPS } from './_constants/steps';

/** 비로그인 CTA는 로그인 후 대시보드로 — 보호 라우트·`/signup` 예외는 `proxy` + `isPublicPath` */
const START_HREF = `/login?${new URLSearchParams({ callbackUrl: '/dashboard' }).toString()}`;

export default function HomePage() {
  return (
    <main className="min-dvh font-pretendard flex flex-col bg-white **:tracking-[-0.03em] dark:bg-black">
      <section className="hero flex w-full flex-col items-center justify-center bg-[linear-gradient(220deg,#FFF9E5_20.84%,#D4FFFE_93.31%)] px-6 pt-20">
        {/* Hero Section */}
        <h2 className="mb-10 flex flex-col gap-y-1 text-center md:gap-y-3 lg:gap-y-4">
          <p className="font-base-semibold md:font-2xl-bold lg:font-3xl-bold text-orange-600 dark:text-orange-300">
            슬리드투두 하나로 정리부터 실행까지
          </p>
          <p className="font-xl-bold md:display-md-bold lg:display-lg-bold text-gray-700 dark:text-gray-200">
            오늘의 할 일, 슬리드투두로 계획해요
          </p>
        </h2>
        <StartButton href={START_HREF}>시작하기</StartButton>
        <Image
          src="/images/hero-dashboard.svg"
          alt="슬리드투두 대시보드 이미지"
          width={1200}
          height={720}
          className="h-full w-full max-w-332 min-w-80 object-cover pt-18.5"
          priority
        />
      </section>
      <section className="features flex w-full flex-col items-center bg-orange-500 text-white lg:flex-row lg:items-center lg:justify-center lg:gap-6 dark:bg-orange-300 dark:text-black">
        {/* Features Section */}
        <aside className="mt-11 ml-7 w-full md:ml-18 lg:mt-0 lg:ml-[-152px] lg:flex lg:flex-1 lg:flex-col lg:items-end">
          <div className="flex w-full max-w-lg flex-col items-start">
            <h2 className="mb-10 flex w-full flex-col gap-y-1 text-left md:gap-y-3 lg:gap-y-4">
              <p className="font-base-semibold md:font-2xl-semibold lg:font-3xl-semibold text-orange-300 dark:text-orange-500">
                더 똑똑한 할 일 관리
              </p>
              <p className="font-xl-bold md:display-md-bold lg:display-lg-bold">
                슬리드 투두가 특별한 이유
              </p>
            </h2>
            <ul className="*:md:font-xl-bold *:lg:font-xl-bold *:font-base-bold flex w-full flex-col items-start gap-4 *:flex *:items-center *:gap-2 *:before:size-8 *:before:shrink-0 *:before:bg-cover *:before:bg-center *:before:bg-no-repeat *:before:content-[''] *:md:before:size-10 *:lg:w-fit *:lg:before:size-10">
              <li className="before:bg-[url('/images/img-task.svg')]">스마트한 할 일 관리</li>
              <li className="before:bg-[url('/images/img-progress.svg')]">진행 상황 시각화</li>
              <li className="before:bg-[url('/images/img-note.svg')]">편리한 학습 노트</li>
            </ul>
          </div>
        </aside>
        <aside className="flex w-full justify-center lg:max-w-none lg:flex-1 lg:justify-start">
          <Image
            src="/images/feature-todo.svg"
            alt="슬리드투두 할 일 이미지"
            width={1200}
            height={720}
            className="h-full w-full max-w-167.5 min-w-80 object-cover pt-12 pb-3 lg:pb-0"
            priority
          />
        </aside>
      </section>
      <section className="steps bg-zinc-50 px-4 pb-11">
        {/* Steps Section */}
        <aside>
          <h2 className="mt-13 mb-11 flex flex-col gap-y-1 text-center md:gap-y-3 lg:gap-y-4">
            <p className="font-base-semibold md:font-2xl-bold lg:font-3xl-semibold text-orange-600 dark:text-orange-300">
              목표 설정부터 기록까지
            </p>
            <p className="font-xl-bold lg:display-lg-bold md:display-md-bold text-gray-700 dark:text-gray-200">
              쉽고 빠르게 할 일을 시작해요
            </p>
          </h2>
        </aside>
        <aside className="cards mx-auto grid grid-cols-1 justify-items-center gap-4 *:max-w-80 md:grid-cols-3 lg:max-w-245 lg:grid-cols-3">
          {STEPS.map((step) => (
            <FeatureCard
              key={step.title}
              id={step.id}
              icon={step.icon}
              title={step.title}
              content={step.content}
            />
          ))}
        </aside>
      </section>
      <section className="community flex w-full flex-col bg-white lg:mx-auto lg:max-w-332 lg:flex-row lg:items-center lg:gap-0 lg:px-8 lg:py-12 dark:bg-black">
        {/* 모바일: order로 텍스트 위·이미지 아래 / lg: 배경 왼쪽·텍스트 오른쪽 */}
        <aside
          className="order-2 aspect-713/500 w-full max-w-178.25 shrink-0 bg-[url('/images/img-community.svg')] bg-cover bg-center bg-no-repeat lg:order-1 lg:aspect-auto lg:min-h-108 lg:max-w-178.25 lg:min-w-0 lg:flex-1 lg:self-stretch"
          aria-hidden
        />
        <aside className="order-1 w-full min-w-0 lg:order-2 lg:flex lg:flex-1 lg:justify-end">
          <h2 className="mb-10 flex max-w-full flex-col gap-y-2 pt-14 pr-10 text-right md:gap-y-3 lg:mb-0 lg:gap-y-4 lg:py-0 lg:pr-12">
            <p className="font-base-semibold md:font-2xl-semibold lg:font-3xl-semibold text-orange-600 dark:text-orange-300">
              활발한 소통 게시판
            </p>
            <p className="font-xl-bold md:display-md-bold lg:display-lg-bold text-gray-700 dark:text-gray-200">
              <span className="block">다양한 사람들과</span>
              <span className="mt-0 block md:mt-2 lg:mt-4.5">서로의 목표를 응원해요</span>
            </p>
          </h2>
        </aside>
      </section>
      <section className="footer flex flex-col items-center justify-center bg-white p-4 md:p-8 lg:p-10 dark:bg-black">
        {/* Footer Section */}
        <footer className="relative flex w-full flex-col items-center justify-center gap-y-10 rounded-[32px] bg-[#FFF8EA] py-21.5 md:gap-y-12 md:rounded-[64px] md:py-40 lg:gap-y-14 lg:rounded-[80px] lg:py-37.5">
          <Image
            src="/images/img-star.svg"
            alt=""
            width={36}
            height={36}
            className="pointer-events-none absolute top-[29.3px] left-[57px] h-auto w-7 md:top-[58px] md:left-[113px] md:w-14 lg:top-[82px] lg:left-[326px] lg:w-20"
            priority
          />
          <Image
            src="/images/img-ellipse.svg"
            alt=""
            width={36}
            height={40}
            className="pointer-events-none absolute top-[66.1px] left-[26.7px] h-auto w-6.75 md:top-[131px] md:left-[53px] md:w-10.5 lg:top-[186px] lg:left-[240px] lg:w-13.5"
            priority
          />
          <Image
            src="/images/img-checkbox.svg"
            alt=""
            width={56}
            height={68}
            className="pointer-events-none absolute right-[28.05px] bottom-[91px] h-auto w-7.5 md:right-[56px] md:bottom-[118px] md:w-12 lg:right-[264px] lg:bottom-[222px] lg:w-15"
            priority
          />
          <h2 className="flex flex-col gap-y-1 text-center md:gap-y-3 lg:gap-y-4">
            <p className="font-base-semibold md:font-2xl-semibold lg:font-3xl-semibold text-orange-600 dark:text-orange-300">
              슬리드투두 하나로 정리부터 실행까지
            </p>
            <p className="font-xl-bold md:display-md-bold lg:display-lg-bold text-gray-700 dark:text-gray-200">
              오늘의 할 일, 슬리드 투두로 계획해요
            </p>
          </h2>
          <StartButton href={START_HREF}>시작하기</StartButton>
        </footer>
      </section>
    </main>
  );
}
