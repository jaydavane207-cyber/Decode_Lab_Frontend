import Project1 from "./Project1";
import Project2 from "./Project2";
import Project3 from "./Project3";

/*
  The notebook, week by week — each project lives in its own file:
    · Project 1 (week 1) → src/Project1.tsx   ·   open with  ?week=1
    · Project 2 (week 2) → src/Project2.tsx   ·   open with  ?week=2
    · Project 3 (week 3) → src/Project3.tsx   ·   this week's page (default)
*/
export default function App() {
  const week = new URLSearchParams(window.location.search).get("week");
  if (week === "1") return <Project1 />;
  if (week === "2") return <Project2 />;
  return <Project3 />;
}
