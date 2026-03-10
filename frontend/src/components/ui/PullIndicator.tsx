"use client";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ArrowDown } from "lucide-react";

interface Props {
  pullY: number;
  pulling: boolean;
  refreshing: boolean;
  threshold?: number;
}

export default function PullIndicator({ pullY, pulling, refreshing, threshold = 72 }: Props) {
  const progress = Math.min(pullY / threshold, 1);
  const visible  = pullY > 4 || refreshing;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
            // Slide down with the pull gesture
            transform: `translateY(${refreshing ? 56 : Math.min(pullY, 88)}px)`,
            transition: refreshing ? "transform 0.25s cubic-bezier(.34,1.56,.64,1)" : "none",
          }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--glass)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: "translateY(-50%)",
            }}>

            {refreshing ? (
              // Spinning indicator
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}>
                <RefreshCw className="w-4 h-4" style={{ color: "var(--green-dark)" }} />
              </motion.div>
            ) : (
              // Arrow that rotates as you pull further
              <motion.div
                animate={{ rotate: pulling ? 180 : progress * 160 }}
                transition={{ duration: 0.15 }}>
                <ArrowDown
                  className="w-4 h-4"
                  style={{
                    color: pulling ? "var(--green-dark)" : "var(--text-3)",
                    transition: "color 0.2s",
                  }} />
              </motion.div>
            )}
          </div>

          {/* "Release to refresh" / "Pull to refresh" label */}
          {progress > 0.5 && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateX(28px) translateY(-50%)",
                fontSize: 11,
                fontWeight: 600,
                color: pulling ? "var(--green-dark)" : "var(--text-3)",
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "nowrap",
                transition: "color 0.2s",
              }}>
              {refreshing ? "Refreshing…" : pulling ? "Release to refresh" : "Pull to refresh"}
            </motion.span>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
