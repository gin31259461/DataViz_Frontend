interface DataVizIconProps {
  color: string;
}

export default function DataVizIcon({ color }: DataVizIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 32 32">
      <style type="text/css">
        {`
          .een{fill: ${color};}
          .twee{fill: ${color};}
        `}
      </style>
      <path
        className="een"
        d="M15,4.041v12.958L28,17c-0.51,6.151-5.72,11-12,11C9.383,28,4,22.617,4,16
      C4,9.72,8.849,4.551,15,4.041z M16,3C8.824,3,3,8.824,3,16s5.824,13,13,13s13-5.824,13-13H16C16,16,16,9.63,16,3L16,3z"
      />
      <path
        className="twee"
        d="M17,2c0,6.63,0,13,0,13h13C30,7.979,23.979,2,17,2z M18,11h10.341
      c0.116,0.327,0.219,0.66,0.307,1H18V11z M18,3.041c1.336,0.11,2.606,0.448,3.783,0.959H18V3.041z M18,5h5.628
      c0.46,0.304,0.898,0.637,1.311,1H18V5z M18,7h7.949c0.288,0.32,0.562,0.651,0.815,1H18V7z M27.418,9
      c0.188,0.324,0.359,0.658,0.517,1H18V9H27.418z M18,14v-1h10.864c0.056,0.329,0.101,0.662,0.129,1H18z"
      />
    </svg>
  );
}
