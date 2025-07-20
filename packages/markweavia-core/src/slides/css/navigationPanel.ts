export const getNavigationPanelCss = () => `
.slide-navigation {
  position: fixed;
  bottom: 2dvh;
  left: 0;
  width: 100dvw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center; 
  gap: 1dvh;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.slide-navigation.simulated-hover { 
  opacity: 1;
}
.slide-navigation:hover {
  opacity: 1;
}


.slide-navigation button {
  background-color: var(--navigation-button-background);
  color: var(--navigation-button-color);
  border: none;
  padding: 0.5dvh 1dvw;
  border-radius: 20px; 
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center; 
  min-width: 60px;
  height: 40px; 
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.slide-navigation button:hover {
  background-color: var(--navigation-button-hover-background);
}

.slide-navigation button:active {
  transform: translateY(1px);
}

.slide-navigation button:disabled {
  background-color: var(--navigation-button-disabled-background);
  cursor: not-allowed;
}
.fullscreen-button {
background-color: var(--secondary-color) !important;
}


#slide-counter {
  background-color: transparent;
  color: var(--navigation-counter-color);
  padding: 0.5dvh 1dvw;
  border-radius: 20px; 
  font-size: 1dvw;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center; 
  min-width: 60px;
  height: 40px; 
  font-variant-numeric: tabular-nums; 
}
`;
