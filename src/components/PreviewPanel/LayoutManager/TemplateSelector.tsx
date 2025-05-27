import { useCallback } from "react";
import { slideTemplates } from "../../../utils/slide-templates";
import DropDownButton from "../../UI/DropDownButton";


export default function TemplateSelector() {

  const slideOptions: Record<string, string> = {};
  Object.keys(slideTemplates).forEach((key) => {
    slideOptions[key] = key;
  });

  const changeTemplate = useCallback((template: string) => {
    console.log(template);
  }, []);

  return (
    <DropDownButton

      color="bg-nord8/80 hover:bg-nord8"
      options={slideOptions}
      onSelect={changeTemplate}
    >
      Template
    </DropDownButton>
  );
}
