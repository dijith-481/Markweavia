import Image from "next/image";
import Link from "next/link";
import useExportFunctions from "@/hooks/useExportFunctions";
import { GitHubIcon, UploadIcon, DownloadIcon, DonateIcon } from "@/components/UI/Icons";
import DropDownButton from "./UI/DropDownButton";

interface AppHeaderProps {
  fileUploadRef: React.RefObject<{ triggerFileUpload: () => void } | null>;
}

export default function AppHeader({ fileUploadRef }: AppHeaderProps) {
  const triggerFileUpload = () => fileUploadRef.current?.triggerFileUpload();

  const { handleDownloadMd, handleSaveAsSlides } = useExportFunctions();

  return (
    <header className="py-1 px-2  md:py-2 h-16    flex justify-between items-center text-nord9 md:px-4">
      <Link href="/" className=" px-2 w-full">
        <Image
          src="/logo.svg"
          alt="Markweavia Text Logo"
          className="  block md:hidden m-0  h-12  "
          width={20}
          height={20}
          priority
        />
        <Image
          src="/markweavia.svg"
          alt="Markweavia Text Logo"
          className=" hidden md:block m-0 h-12   "
          width={180}
          height={40}
          priority
        />
      </Link>
      <div className="flex items-center justify-center space-x-2 w-full ">
        <div
          className="flex flex-row items-center group transition-all  px-1 py-1 rounded-md ease-in-out duration-700  w-10 hover:w-32 overflow-hidden"
          title="Upload a Markdown file (.md) (Ctrl+O)"
        >
          <DropDownButton
            color="text-nord9"
            options={{
              Slides: "HTML Slides",
              ".md": "Markdown (.md)",
            }}
            onSelect={(option) => {
              if (option === ".md") {
                handleDownloadMd();
              } else {
                handleSaveAsSlides();
              }
            }}
          >
            <span className="flex-shrink-0 ">
              <DownloadIcon />
            </span>
            <div className="whitespace-nowrap  opacity-0   group-hover:opacity-100 transition-opacity duration-700">
              <span className="ml-1.5 whitespace-nowrap  opacity-0   group-hover:opacity-100 transition-opacity duration-700">
                Download
              </span>
            </div>
          </DropDownButton>
        </div>
        <button
          onClick={triggerFileUpload}
          className="flex flex-row items-center group transition-all  px-1 py-1 rounded-md ease-in-out duration-700  w-10 hover:w-24 overflow-hidden"
          title="Upload a Markdown file (.md) (Ctrl+O)"
        >
          <span className="flex-shrink-0">
            <UploadIcon />
          </span>
          <span className="ml-1.5 whitespace-nowrap  opacity-0   group-hover:opacity-100 transition-opacity duration-700">
            Upload
          </span>
        </button>{" "}
      </div>

      <div className="flex items-center justify-end space-x-2 w-full ">
        <a
          href="https://github.com/sponsors/dijith-481"
          className="flex flex-row items-center group transition-all px-1 py-1 rounded-md ease-in-out duration-700 w-10 hover:w-24 overflow-hidden"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="flex-shrink-0">
            <DonateIcon />
          </span>
          <span className="ml-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            Sponser
          </span>
        </a>
        <a
          href="https://github.com/dijith-481/markweavia"
          className="flex flex-row items-center group transition-all  px-1 py-1 rounded-md ease-in-out duration-700  w-10 hover:w-24 overflow-hidden"
        >
          <span className="flex-shrink-0">
            <GitHubIcon />
          </span>
          <span className="ml-1.5 whitespace-nowrap  opacity-0   group-hover:opacity-100 transition-opacity duration-700">
            Github
          </span>
        </a>{" "}
      </div>
    </header>
  );
}
