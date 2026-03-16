import type { SVGProps } from 'react';

export const KakaoIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...props}
    >
      <rect width="24" height="24" fill="url(#pattern0_13460_59506)" />
      <defs>
        <pattern
          id="pattern0_13460_59506"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <use
            xlinkHref="#image0_13460_59506"
            transform="translate(0 0.0398773) scale(0.00153374)"
          />
        </pattern>
        <image
          id="image0_13460_59506"
          width="652"
          height="600"
          preserveAspectRatio="none"
          xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAowAAAJYCAYAAADonLfv..."
        />
      </defs>
    </svg>
  );
};
