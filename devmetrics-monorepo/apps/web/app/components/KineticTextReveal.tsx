"use client";

import { useRef } from "react";
import { motion, useInView, type Variant } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────

type SplitBy = "words" | "chars" | "lines";
type Direction = "up" | "down" | "left" | "right";

interface KineticTextRevealProps {
  /** The text to animate. Also accepts JSX children for inline elements. */
  children: string;
  /** How to split the text for staggered reveal. Default: "words" */
  splitBy?: SplitBy;
  /** Direction the text enters from. Default: "up" */
  direction?: Direction;
  /** Apply a blur-to-sharp transition on each token. Default: true */
  blur?: boolean;
  /** Delay between each token in seconds. Default: 0.08 */
  stagger?: number;
  /** Start the animation immediately when the element enters the viewport. Default: true */
  autoPlay?: boolean;
  /** Viewport intersection threshold (0–1) to trigger. Default: 0.15 */
  threshold?: number;
  /** Only animate once — don't replay on scroll-back. Default: true */
  once?: boolean;
  /** Additional className passed to the outer wrapper */
  className?: string;
  /** Inline styles for the outer wrapper */
  style?: React.CSSProperties;
  /** The HTML tag for the wrapper element. Default: "span" */
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
}

// ─── Direction → transform map ────────────────────────────────

function getTranslate(direction: Direction, distance = 24): string {
  switch (direction) {
    case "up":    return `translateY(${distance}px)`;
    case "down":  return `translateY(-${distance}px)`;
    case "left":  return `translateX(${distance}px)`;
    case "right": return `translateX(-${distance}px)`;
  }
}

// ─── Component ────────────────────────────────────────────────

export function KineticTextReveal({
  children,
  splitBy = "words",
  direction = "up",
  blur = true,
  stagger = 0.08,
  autoPlay = true,
  threshold = 0.15,
  once = true,
  className = "",
  style,
}: KineticTextRevealProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(wrapperRef, {
    amount: threshold,
    once,
  });

  // Split text into tokens
  const tokens = splitText(children, splitBy);

  // Animation variants
  const hidden: Variant = {
    opacity: 0,
    transform: getTranslate(direction, 24),
    filter: blur ? "blur(8px)" : "blur(0px)",
  };

  const visible: Variant = {
    opacity: 1,
    transform: "translateY(0px) translateX(0px)",
    filter: "blur(0px)",
  };

  const shouldAnimate = autoPlay ? isInView : false;

  return (
    <motion.span
      ref={wrapperRef}
      className={className}
      style={{
        display: "inline",
        ...style,
      }}
      aria-label={children}
    >
      {tokens.map((token, i) => (
        <motion.span
          key={`${token}-${i}`}
          initial={hidden}
          animate={shouldAnimate ? visible : hidden}
          transition={{
            duration: 0.55,
            delay: i * stagger,
            ease: [0.25, 0.46, 0.45, 0.94], // cubic-bezier — smooth editorial ease
          }}
          style={{
            display: "inline-block",
            willChange: "transform, opacity, filter",
            // Preserve whitespace between words
            ...(splitBy === "words" && token === " "
              ? { width: "0.3em" }
              : {}),
          }}
        >
          {/* For words, add trailing space inline so layout stays correct */}
          {splitBy === "words"
            ? token === " "
              ? "\u00A0"
              : token
            : token}
          {/* Add a word-space after each word (except spaces themselves) */}
          {splitBy === "words" && token !== " " && i < tokens.length - 1
            ? "\u00A0"
            : null}
        </motion.span>
      ))}
    </motion.span>
  );
}

// ─── Text splitter ────────────────────────────────────────────

function splitText(text: string, splitBy: SplitBy): string[] {
  switch (splitBy) {
    case "chars":
      return text.split("");
    case "lines":
      return text.split("\n");
    case "words":
    default:
      return text.split(/\s+/).filter(Boolean);
  }
}

export default KineticTextReveal;
