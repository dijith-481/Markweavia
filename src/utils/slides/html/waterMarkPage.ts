export const getWaterMarkSlide = (pageNo: number) => ` 
    <div data-slide-index="${pageNo}" class="slide">
      <div class="slide-content-wrapper" style="height: 100%; width: 100%">
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: end;
            align-items: center;
            gap: 0.4em;
            font-size: var(--slide-font-size);
            font-weight: 300;
            font-style: italic;
            width: 100%;
            height: 100%;
            opacity: 0.5;
          "
        >
          <div style="opacity: 0.3">
            <svg
              width="117.792"
              height="94.875"
              viewBox="0 0 235.792 189.375"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g
                id="svgGroup"
                stroke-linecap="round"
                fill-rule="evenodd"
                font-size="9pt"
                stroke="#00000000"
                stroke-width="0.25mm"
                fill="currentColor"
                style="stroke: #00000000; stroke-width: 0.25mm; fill: #81a1c1"
              >
                <path
                  d="M 6.667 164.875 L 11.417 153.875 L 62.792 0 L 118.042 106.75 L 171.667 0 L 235.792 184.875 L 168.667 184.875 L 137.667 89.375 L 89.667 189.375 L 39.167 99.375 L 21.667 154 A 161.562 161.562 0 0 0 19.111 159.948 Q 18.026 162.632 17.196 165.02 A 70.807 70.807 0 0 0 15.792 169.5 Q 14.042 175.875 12.917 179.375 A 18.426 18.426 0 0 1 11.704 182.35 Q 9.382 186.78 5.342 186.78 A 7.79 7.79 0 0 1 4.667 186.75 Q 2.292 186.5 1.042 184.625 A 5.984 5.984 0 0 1 0 181.24 A 6.694 6.694 0 0 1 0.042 180.5 A 22.7 22.7 0 0 1 1.984 174.223 A 21.213 21.213 0 0 1 2.417 173.375 A 406.22 406.22 0 0 0 3.233 171.852 Q 4.37 169.719 4.979 168.5 Q 5.792 166.875 6.667 164.875 Z"
                  vector-effect="non-scaling-stroke"
                />
              </g>
            </svg>
          </div>
          <div>
            Made with
            <a
              style="text-decoration: underline"
              href="https://markweavia.vercel.app"
              >Markweavia</a
            >
          </div>
          <div style="font-size: 1.4dvw; color: var(--primary-color)">
            Markdown, beautifully woven.
          </div>
        </div>
      </div>

      <div class="slide-header-footer-item pos-top-right">
        <a
          href="https://github.com/dijith-481/markweavia"
          style="text-decoration: none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="24"
            height="24"
            viewBox="0 0 30 30"
            fill="currentColor"
          >
            <path
              d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"
            ></path>
          </svg>
        </a>
      </div>
      <div class="slide-header-footer-item pos-bottom-right">
        <a
          style="opacity: 0.4"
          href="https://markweavia.vercel.app"
          style="text-decoration: none"
        >
          Create your own Slides
        </a>
      </div>
    </div>
`;
