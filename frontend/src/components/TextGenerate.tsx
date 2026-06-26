"use client";

import { useEffect, useRef, useState, type ElementType } from "react";

/**
 * Aceternity-style "text generate" effect, dependency-free.
 * Each word fades in from a blur as the block scrolls into view.
 */
export function TextGenerate({
  text,
  as: Tag = "p",
  className = "",
  stagger = 70,
  duration = 900,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  stagger?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setOn(true);
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden>
          <span
            style={{
              display: "inline-block",
              opacity: on ? 1 : 0,
              filter: on ? "blur(0px)" : "blur(8px)",
              transform: on ? "translateY(0)" : "translateY(6px)",
              transition: `opacity ${duration}ms ease, filter ${duration}ms ease, transform ${duration}ms ease`,
              transitionDelay: `${i * stagger}ms`,
            }}
          >
            {w}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
