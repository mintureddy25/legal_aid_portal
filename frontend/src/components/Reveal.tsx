"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type Variant = "up" | "up-lg" | "left" | "right" | "scale";

const variantClass: Record<Variant, string> = {
  up: "",
  "up-lg": "reveal-up-lg",
  left: "reveal-left",
  right: "reveal-right",
  scale: "reveal-scale",
};

/**
 * Reveals its children on scroll using IntersectionObserver — no animation lib.
 * Honors prefers-reduced-motion via CSS. `delay` staggers grouped items.
 */
export function Reveal({
  children,
  as: Tag = "div",
  variant = "up",
  delay = 0,
  once = true,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  variant?: Variant;
  delay?: number;
  once?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            if (once) obs.unobserve(e.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  // `delay` is intentionally ignored: everything in a section reveals at once.
  void delay;
  return (
    <Tag
      ref={ref}
      className={`reveal ${variantClass[variant]} ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
