import * as React from "react";
import type { BaseAccordionViewProps } from "../../types/accordion";

function AccordionTriggerView(props: BaseAccordionViewProps) {
  return (
    <button type="button" {...props.attributes}>
      {props.children}
    </button>
  );
}

export default AccordionTriggerView;
