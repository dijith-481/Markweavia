export const CheckboxIcon = ({ checked }: { checked: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-3.5 w-3.5 ${!checked ? "opacity-60" : ""}`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    {checked ? (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    ) : (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
        clipRule="evenodd"
      />
    )}
  </svg>
);
export const substractIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  </svg>
);
export const addIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
export const infoIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    className="h-4 w-4"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);
export const expandIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

export const UploadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 md:h-4 md:w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
    />
  </svg>
);

export const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 md:h-4 md:w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
    />
  </svg>
);

export const MarkdownIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

export const SlidesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="24"
    height="24"
    viewBox="0 0 30 30"
    fill="currentColor"
  >
    <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
  </svg>
);

export const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-3.5 w-3.5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export const DonateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="4"
    className="w-4 h-4"
  >
    <path d="M12 21.35L10.55 20.03C5.65 15.54 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.65 7.04-8.55 11.53L12 21.35z" />
  </svg>
);

export const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4"
  >
    <path d="M12 21.35L10.55 20.03C5.65 15.54 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.65 7.04-8.55 11.53L12 21.35z" />
  </svg>
);

export const SlideShowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    className="w-5 h-5"
    fill="currentColor"
  >
    <path d="m380-300 280-180-280-180v360ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" />
  </svg>
);

export const StopCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24px"
    viewBox="0 -960 960 960"
    className="h-5 w-5"
    fill="currentColor"
  >
    <path d="M320-320h320v-320H320v320ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
  </svg>
);
export const VimIcon = () => (
  <svg
    height="32"
    viewBox="0 0 34 32"
    className="h-6 w-6"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg "
  >
    <path d="m18.752 19.442c.042.042.125.105.188.105h1.109c.063 0 .146-.063.188-.105l.293-.314c.042-.042.063-.084.063-.125l.314-1.067c.021-.105 0-.209-.063-.272l-.23-.188c-.042-.042-.125-.021-.188-.021h-1.004l-.063-.063c-.042 0-.084-.021-.126.021l-.398.251c-.042 0-.063.105-.084.146l-.335 1.025c-.042.105-.021.23.063.314l.272.293zm.167 5.524-.084.021h-.251l1.507-4.415c.042-.146-.021-.314-.167-.356l-.084-.021h-2.532c-.105.021-.188.105-.209.209l-.146.523c-.042.146.063.272.209.314l.063-.021h.377l-1.528 4.373c-.042.146.021.335.167.398l.084.063h2.344c.125 0 .23-.105.272-.23l.146-.502c.063-.147-.021-.314-.167-.356zm11.112-4.122-.398-.523v-.021c-.063-.063-.125-.125-.209-.125h-1.507c-.084 0-.146.084-.209.125l-.419.502h-.649l-.439-.502v-.021c-.042-.063-.126-.105-.209-.105h-.837l4.227-4.227-4.729-4.687 4.227-4.352v-1.883l-.586-.753h-8.558l-.691.732v.607l-2.365-2.385-1.611 1.569-.502-.523h-8.454l-.67.774v1.967l.628.607h.628v5.461l-2.929 2.929 2.929 2.93v6.696l1.088.607h2.427l1.904-1.988 4.52 4.52 3.034-3.034c.021.084.084.105.188.146l.084-.042h1.967c.126 0 .23-.021.251-.125l.146-.418c.042-.146-.021-.272-.167-.314l-.084.021h-.084l.712-2.239.481-.481h1.046l-1.046 3.327c-.042.146.042.23.188.293l.084-.042h1.904c.105 0 .209-.021.251-.125l.167-.377c.063-.146-.021-.272-.146-.335-.021-.021-.063 0-.105 0h-.084l.879-2.72h1.276l-1.067 3.327c-.042.146.042.23.188.272l.084-.063h2.093c.105 0 .209-.021.251-.125l.167-.418c.063-.146-.021-.272-.167-.314-.021-.021-.063.021-.105.021h-.146l1.172-3.871c.042-.105.021-.23-.021-.293zm-13.351-17.221 2.365 2.365v.984l.711.858h.335l-6.068 5.859v-5.859h.691l.565-.879v-1.862l-.042-.063 1.444-1.402zm-12.513 12.387 2.532-2.532v5.064zm8.14 8.015 12.22-12.555 4.478 4.499-4.227 4.227h-.021c-.063.021-.105.063-.146.105l-.439.502h-.607l-.46-.502c-.042-.063-.126-.125-.209-.125h-1.841c-.125 0-.23.084-.272.209l-.167.523c-.042.146.021.272.167.335h.314l-1.339 3.955-3.16 3.181-4.29-4.352z" />
  </svg>
);
