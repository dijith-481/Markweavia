import { slideTemplates } from "../../../utils/slide-templates";
import DropDownButton from "../../UI/DropDownButton";
import { useSlideContext } from "@/context/slideContext";

export default function TemplateSelector() {
  const slideOptions: Record<string, string> = {};
  Object.keys(slideTemplates).forEach((key) => {
    slideOptions[key] = key;
  });
  const { markdownText, setMarkdownText } = useSlideContext();

  const loadTemplate = (templateKey: string) => {
    if (markdownText.trim() && !confirm("Your edits will be lost. Continue?")) {
      return;
    }
    setMarkdownText(slideTemplates[templateKey as keyof typeof slideTemplates]);
  };

  return (
    <DropDownButton
      color="bg-nord8/80 hover:bg-nord8"
      options={slideOptions}
      onSelect={loadTemplate}
    >
      Template
    </DropDownButton>
  );
}
