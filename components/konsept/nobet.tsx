import type { ConceptProps } from "./registry";

/** Yer tutucu: konsept henüz kodlanmadı. */
export default function Concept({ facts }: ConceptProps) {
  return (
    <main style={{ padding: "2rem 1.25rem", fontFamily: "system-ui" }}>
      <h1>{facts.name}</h1>
      <p>&quot;nobet&quot; konsepti yapım aşamasında.</p>
    </main>
  );
}
