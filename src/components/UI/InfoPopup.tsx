import { CloseIcon } from "./Icons";

interface InfoPopupProps {
  show: boolean;
  onClose: () => void;
  popupRef: React.RefObject<HTMLDivElement | null>;
}

export default function InfoPopup({ show, onClose, popupRef }: InfoPopupProps) {
  if (!show) return null;

  return (
    <div
      ref={popupRef}
      className="absolute bottom-full right-0 mb-2 w-72 md:w-96 max-h-96 overflow-y-auto flex items-end flex-col  p-4 bg-nord9/20 backdrop-blur-lg rounded-md shadow-xl z-50 text-nord5 text-xs leading-relaxed"
    >
      <button
        onClick={onClose}
        className="sticky top-2 right-2 p-0.5 rounded-full hover:bg-nord11 bg-nord1/80 backdrop-blur-lg  z-100 "
        aria-label="Close info"
      >
        <CloseIcon />
      </button>
      <div>
        <h3 className="font-semibold text-nord8 text-sm mb-2">Editor Information</h3>
        <p className="mb-1">
          <strong className="text-nord7">Focus Editor:</strong> Press <kbd>i</kbd> to quickly focus
          the Markdown editor.
        </p>
        <p className="mb-1">
          <strong className="text-nord7">Delete All Content:</strong> Press <kbd>ggdG</kbd> to
          quickly delete all content
        </p>

        <ul className="mb-1">
          <strong className="text-nord7">Vim Mode:</strong> Basic Vim keybindings are enabled.
          <li>
            <kbd>Esc</kbd>
          </li>
          <li>
            <kbd>i</kbd>
          </li>
          <li>
            <kbd>:w</kbd> to save .md
          </li>
          <li>
            <kbd>:ws</kbd> to save slides,{" "}
          </li>
          <li>
            <kbd>:u</kbd> to upload
          </li>
          <li>
            <kbd>:p</kbd> to preview
          </li>
          <li>
            <kbd>:page</kbd> to toggle page number
          </li>
          <li>
            <kbd>:h</kbd> to add headerfooter
          </li>
          <li>
            <kbd>:t</kbd> to switch to next theme
          </li>
        </ul>
        <p className="mb-1">
          <strong className="text-nord7">Slide Creation:</strong> Use Markdown headings
          <code className="">#</code>, <code className="">##</code> for new slides.
        </p>
        <p className="mb-1">
          <strong className="text-nord7">Live Preview:</strong> Shows the current slide.
        </p>
        <p>
          <strong className="text-nord7">Exporting:</strong> Use header buttons or Vim commands.
        </p>
        <p>for more information on how to use Markweavia check out</p>
        <a href="https://github.com/dijith-481/markweavia" className="text-nord9 underline text-xs">
          Github readme.
        </a>
      </div>
    </div>
  );
}
