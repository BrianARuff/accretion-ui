import { useMetadata } from '@builder.io/mitosis';
import type { BaseAccordionViewProps } from '../../types/accordion';

useMetadata({
  angular: {
    changeDetection: 'OnPush',
  },
  attributePassing: {
    enabled: true,
  },
});

export default function AccordionTriggerView(props: BaseAccordionViewProps) {
  return (
    <button type="button" {...props.attributes}>
      {props.children}
    </button>
  );
}
