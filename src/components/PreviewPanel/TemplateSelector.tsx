import React from "react";
import { slideTemplates } from "../../utils/slide-templates";
import DropDownButton from "../UI/DropDownButton";

interface TemplateSelectorProps {
  onLoadTemplate: () => void;
}

export default function TemplateSelector({
  onLoadTemplate,
}: TemplateSelectorProps) {

  const slideOptions: Record<string, string> = {};
  Object.keys(slideTemplates).forEach((key) => {
    slideOptions[key] = key;
  });

  return (
    <DropDownButton

      color="bg-nord8/80 hover:bg-nord8"
      options={slideOptions}
      onSelect={onLoadTemplate}
    >
      Template
    </DropDownButton>
  );
}
