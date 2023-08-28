import React from 'react';

const ChatIcon = ({ onClick }) => (
  <div onClick={onClick}>
  <svg xmlns="http://www.w3.org/2000/svg" width="88" height="88" viewBox="0 0 88 88" fill="none">
    <g filter="url(#filter0_d_63_2030)">
      <rect x="4" width="80" height="80" rx="6" fill="#A0192A" shape-rendering="crispEdges"/>
      <path d="M33.0556 40H33.0817M43.5 40H43.5261M53.9444 40H53.9706M67 40C67 51.598 56.4787 61 43.5 61C39.4808 61 35.6973 60.0983 32.3889 58.509L20 61L23.6425 51.2351C21.3358 47.9862 20 44.1325 20 40C20 28.402 30.5213 19 43.5 19C56.4787 19 67 28.402 67 40Z" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
      <filter id="filter0_d_63_2030" x="0" y="0" width="88" height="88" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="2"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_63_2030"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_63_2030" result="shape"/>
      </filter>
    </defs>
  </svg>
  </div>
);

export default ChatIcon;
