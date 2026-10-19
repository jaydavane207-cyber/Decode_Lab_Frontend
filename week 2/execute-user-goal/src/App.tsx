import Project1 from "./Project1";
import Project2 from "./Project2";

/*
  The notebook, week by week — each project lives in its own file:
    · Project 1 (week 1) → src/Project1.tsx   ·   open with  ?week=1
    · Project 2 (week 2) → src/Project2.tsx   ·   this week's page (default)
*/
export default function App() {
  const week = new URLSearchParams(window.location.search).get("week");
  return week === "1" ? <Project1 /> : <Project2 />;
}
