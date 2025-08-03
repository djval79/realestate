
import React from 'react';

interface HeartIconProps extends React.SVGProps<SVGSVGElement> {
  filled?: boolean;
}

export const HeartIcon: React.FC<HeartIconProps> = ({ filled = false, ...props }) => {
  if (filled) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.344-.688 11.855 11.855 0 01-1.966-1.603 3.17 3.17 0 01-.84-1.54l-.019-.055a3.182 3.182 0 01.196-1.486c.155-.38.43-.74.76-1.044l.003-.002c.009-.009.019-.018.028-.028l.002-.002.001-.001a4.5 4.5 0 015.714 0l.002.002.002.002.003.002c.33.304.605.664.76 1.044a3.182 3.182 0 01.196 1.486l-.019.055a3.17 3.17 0 01-.84 1.54 11.856 11.856 0 01-1.966 1.603 15.247 15.247 0 01-1.344.688l-.022.012-.007.003z" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
};
