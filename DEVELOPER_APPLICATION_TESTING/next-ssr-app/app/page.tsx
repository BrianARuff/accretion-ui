import { ManualReviewAccordion } from '../components/manual-review-accordion';

export default function Home() {
  return (
    <main className="review-shell">
      <section className="hero">
        <p className="eyebrow">Developer application testing</p>
        <h1>React Accordion manual review</h1>
        <p className="intro">
          This app exercises controlled state, multiple expansion, disabled
          items, kept-mounted content, and split triggers where the left text
          control and right icon control can be tested independently.
        </p>
      </section>

      <ManualReviewAccordion />
    </main>
  );
}
