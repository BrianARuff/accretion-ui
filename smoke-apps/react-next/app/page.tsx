import { AccordionDemo } from '../components/accordion-demo';

export default function Page() {
  return (
    <main className="page-shell">
      <h1>React SSR Smoke Validation</h1>
      <p>
        This app validates that the generated React Accordion renders on the
        server, hydrates cleanly, and keeps its accessibility contract intact in
        a real Next.js runtime.
      </p>
      <AccordionDemo />
    </main>
  );
}
