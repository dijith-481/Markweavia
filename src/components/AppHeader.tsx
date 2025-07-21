import Image from "next/image";
import Link from "next/link";
import { GitHubIcon, UploadIcon, DownloadIcon, DonateIcon } from "@/components/UI/Icons";
import DropDownButton from "./UI/DropDownButton";
import { useEffect, useState } from "react";
import { downloadMd, downloadSlides } from "@/utils/download";
import { useSlideContext } from "@/context/slideContext";
import useConfig from "@/hooks/useConfig";

interface AppHeaderProps {
  fileUploadRef: React.RefObject<{ triggerFileUpload: () => void } | null>;
}

export default function AppHeader({ fileUploadRef }: AppHeaderProps) {
  const triggerFileUpload = () => fileUploadRef.current?.triggerFileUpload();
  const { editorViewRef, markdownText } = useSlideContext();
  const config = useConfig();

  const [starCount, setStarCount] = useState(0);

  const download = (option: string) => {
    switch (option) {
      case "Slides":
        downloadSlides(markdownText, config);
        break;
      case ".md":
        downloadMd(editorViewRef.current?.state.doc.toString() || markdownText);
        break;
    }
  };

  useEffect(() => {
    fetch("https://api.github.com/repos/dijith-481/markweavia")
      .then((response) => response.json())
      .then((data) => setStarCount(data.stargazers_count));
  }, []);

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
            onSelect={download}
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
          href="https://github.com/dijith-481/markweavia"
          className="flex flex-row items-center group transition-all  px-1 py-1 rounded-md ease-in-out duration-700  w-10 hover:w-24 overflow-hidden"
        >
          <span className="flex-shrink-0   leading-2 flex items-center flex-col justify-center">
            <GitHubIcon />
            <span className="text-[0.5rem] leading-1 ">{starCount}</span>
          </span>
          <span className="ml-1.5 whitespace-nowrap  opacity-0   group-hover:opacity-100 transition-opacity duration-700">
            Github
          </span>
        </a>{" "}
        <a
          href="https://github.com/sponsors/dijith-481"
          className="flex flex-row items-center hover:font-bold transition-all px-1 py-1 rounded-md ease-in-out duration-700  w-24 overflow-hidden"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="flex-shrink-0">
            <DonateIcon />
          </span>
          <span className="ml-1.5 whitespace-nowrap    ">Sponser</span>
        </a>
      </div>
    </header>
  );
}
