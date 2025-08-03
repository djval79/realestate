
import React from 'react';

export const FlagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.695a9 9 0 016.46 0l2.77.695m-9.23 0l2.77-.695a9 9 0 006.46 0l2.77.695M3 15V4.5m18 10.5V4.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 3v1.5m0 16.5v-6m0 0l-2.77-.695a9 9 0 00-6.46 0l-2.77.695m9.23 0l-2.77-.695a9 9 0 01-6.46 0l-2.77.695" />
  </svg>
);
