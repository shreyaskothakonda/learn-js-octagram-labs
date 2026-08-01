"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConceptVisualProps } from "./index";
import { Stage, Panel, Frame, Chip, enter, focusOn, focusOff } from "./kit";

// Scene: four quadrants (method, standalone, call/bind, arrow/lexical) each
// hold their own call-site Frame and their own "this ->" target Chip. The
// execution focus steps through the quadrants in turn, one at a time, so all
// four binding rules get demonstrated instead of only the first two.
export function TheThisKeywordVisual({ register }: ConceptVisualProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    const build = (animate: boolean) => {
      const tl = gsap.timeline({ paused: true });
      gsap.set(
        [
          "#call-method",
          "#this-method",
          "#call-standalone",
          "#this-standalone",
          "#call-callbind",
          "#this-callbind",
          "#call-arrow",
          "#this-arrow",
        ],
        { opacity: 0, y: 12 },
      );
      gsap.set(".glow", { opacity: 0 });

      if (animate) {
        // METHOD: user.greet() is called as a property of user, so this -> user
        enter(tl, ["#call-method", "#this-method"]);
        focusOn(tl, "#call-method", "+=0.1");
        focusOff(tl, "#call-method", "+=0.5");

        // STANDALONE: a plain call has no receiver, so this -> undefined (strict mode)
        enter(tl, ["#call-standalone", "#this-standalone"], "+=0.15");
        focusOn(tl, "#call-standalone", "+=0.1");
        focusOff(tl, "#call-standalone", "+=0.5");

        // CALL / BIND: .call(admin) sets this explicitly for that one invocation;
        // .bind(admin) instead returns a new function permanently bound to admin
        enter(tl, ["#call-callbind", "#this-callbind"], "+=0.15");
        focusOn(tl, "#call-callbind", "+=0.1");
        focusOff(tl, "#call-callbind", "+=0.5");

        // ARROW (LEXICAL): an arrow defined inside the method has no this of its
        // own; it captures this from the enclosing scope at the call site
        enter(tl, ["#call-arrow", "#this-arrow"], "+=0.15");
        focusOn(tl, "#call-arrow", "+=0.1");
      } else {
        // reduced motion: jump to labeled end-state, all four quadrants filled
        // in, with the arrow/lexical quadrant (the last one demonstrated) lit
        tl.set(
          [
            "#call-method",
            "#this-method",
            "#call-standalone",
            "#this-standalone",
            "#call-callbind",
            "#this-callbind",
            "#call-arrow",
            "#this-arrow",
          ],
          { opacity: 1, y: 0 },
        )
          .set("#call-arrow .glow", { opacity: 1 })
          .set("#call-arrow", { scale: 1.03 });
      }
      register(tl);
      return tl;
    };
    mm.add("(prefers-reduced-motion: reduce)", () => { build(false); });
    mm.add("(prefers-reduced-motion: no-preference)", () => { build(true); });
    return () => mm.revert();
  }, { scope });

  return (
    <Stage
      refEl={scope}
      height={300}
      label="Four quadrants, method, standalone, call or bind, and arrow (lexical), each show their own call site and a this-> target. The execution focus steps through them in turn: user.greet() binds this to user; a plain greet() call binds this to undefined in strict mode; greet.call(admin) binds this to admin for that call, while greet.bind(admin) returns a new function permanently bound to admin; and an arrow function defined inside the method has no this of its own, taking this lexically from the enclosing scope"
    >
      <Panel label="Method" style={{ left: 0, top: 0, width: 190, height: 130 }} />
      <Panel label="Standalone" style={{ left: 210, top: 0, width: 190, height: 130 }} />
      <Panel label="Call / bind" style={{ left: 0, top: 150, width: 190, height: 130 }} />
      <Panel label="Arrow (lexical)" style={{ left: 210, top: 150, width: 190, height: 130 }} />

      {/* METHOD */}
      <Frame id="call-method" style={{ left: 14, top: 40, width: 162, height: 40 }}>
        user.greet()
      </Frame>
      <Chip id="this-method" style={{ position: "absolute", left: 14, top: 88, width: 162 }}>
        this -&gt; user
      </Chip>

      {/* STANDALONE */}
      <Frame id="call-standalone" style={{ left: 224, top: 40, width: 162, height: 40 }}>
        greet()
      </Frame>
      <Chip
        id="this-standalone"
        className="!bg-[var(--color-destructive)]/10 !text-[var(--color-destructive)]"
        style={{ position: "absolute", left: 224, top: 88, width: 162 }}
      >
        this -&gt; undefined
      </Chip>

      {/* CALL / BIND */}
      <Frame id="call-callbind" style={{ left: 14, top: 186, width: 162, height: 52 }}>
        <span className="flex flex-col leading-tight">
          <span>greet.call(admin)</span>
          <span className="text-[10px] text-muted-foreground">.bind(admin) -&gt; new fn</span>
        </span>
      </Frame>
      <Chip id="this-callbind" style={{ position: "absolute", left: 14, top: 244, width: 162 }}>
        this -&gt; admin
      </Chip>

      {/* ARROW (LEXICAL) */}
      <Frame id="call-arrow" style={{ left: 224, top: 186, width: 162, height: 52 }}>
        <span className="flex flex-col leading-tight">
          <span>() =&gt; this</span>
          <span className="text-[10px] text-muted-foreground">defined inside greet()</span>
        </span>
      </Frame>
      <Chip id="this-arrow" style={{ position: "absolute", left: 224, top: 244, width: 162 }}>
        this -&gt; enclosing
      </Chip>
    </Stage>
  );
}
