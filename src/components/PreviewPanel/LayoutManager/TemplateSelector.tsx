import { slideTemplates } from "../../../utils/slide-templates";
import DropDownButton from "../../UI/DropDownButton";
import { useSlideContext } from "@/context/slideContext";

export default function TemplateSelector() {
  const slideOptions: Record<string, string> = {};
  Object.keys(slideTemplates).forEach((key) => {
    slideOptions[key] = key;
  });
  const { markdownText, editorViewRef } = useSlideContext();

  const loadTemplate = (templateKey: string) => {
    if (markdownText.trim() && !confirm("Your edits will be lost. Continue?")) {
      return;
    }
    const content = slideTemplates[templateKey as keyof typeof slideTemplates].trim();
    const hashIndex = content.indexOf("# ");

    editorViewRef.current?.dispatch({
      changes: {
        from: 0,
        to: editorViewRef.current?.state.doc.length,
        insert: content,
      },

      selection: { anchor: hashIndex },
    });
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
