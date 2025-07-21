export const getNavigationHtml = () => `<div class="slide-navigation">
          <button id="start-slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"
              />
            </svg>
          </button>
          <button id="prev-slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <span id="slide-counter">1 / N</span>
          <button id="next-slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>
          <button id="end-slide">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"
              />
            </svg>
          </button>
          <button id="fullscreen">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path
                d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"
              />
            </svg>
          </button>
        </div>
`;
