"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, TrendingDown, Lightbulb, Users, X, Check } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface Notification {
  id: string;
  type: "funded" | "price" | "tip" | "proposal" | "invest";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

function getDefaultNotifications(role: string, name: string, state: string): Notification[] {
  const farmerNotifs: Notification[] = [
    {
      id: "1", type: "tip",
      title: "New negotiation tip",
      body: "AI Coach: \"Always ask for the modal price certificate before accepting any mandi offer.\"",
      time: "2m ago", read: false,
    },
    {
      id: "2", type: "price",
      title: "Wheat price alert",
      body: `Wheat prices dropped 4.2% in ${state} today. Consider holding stock for 3–5 days.`,
      time: "1h ago", read: false,
    },
    {
      id: "3", type: "proposal",
      title: "Proposal tip",
      body: "Proposals with ROI above 15% get 3× more investor views. Update your pitch!",
      time: "3h ago", read: false,
    },
    {
      id: "4", type: "tip",
      title: "Seasonal advisory",
      body: "Rabi season is ideal for wheat & mustard. Soil moisture is favourable this week.",
      time: "Yesterday", read: true,
    },
  ];

  const investorNotifs: Notification[] = [
    {
      id: "1", type: "invest",
      title: "New proposal published",
      body: "A wheat farmer in Maharashtra just published a ₹50,000 proposal at 18% ROI.",
      time: "5m ago", read: false,
    },
    {
      id: "2", type: "funded",
      title: "Investment confirmed",
      body: "Your investment in \"Rice Farm — 8 acres\" has been confirmed by the farmer.",
      time: "2h ago", read: false,
    },
    {
      id: "3", type: "price",
      title: "Cotton price surge",
      body: "Cotton prices rose 6.1% this week — proposals in cotton farming show higher ROI potential.",
      time: "5h ago", read: false,
    },
    {
      id: "4", type: "tip",
      title: "Portfolio tip",
      body: "Diversifying across 3+ crops reduces weather-related risk by up to 40%.",
      time: "Yesterday", read: true,
    },
  ];

  return role === "investor" ? investorNotifs : farmerNotifs;
}

const iconMap = {
  funded:   { icon: CheckCircle,  color: "#22c55e", bg: "#dcfce7" },
  price:    { icon: TrendingDown, color: "#f59e0b", bg: "#fef3c7" },
  tip:      { icon: Lightbulb,    color: "#6366f1", bg: "#e0e7ff" },
  proposal: { icon: Users,        color: "#ec4899", bg: "#fce7f3" },
  invest:   { icon: CheckCircle,  color: "#22c55e", bg: "#dcfce7" },
};

export default function NotificationCenter() {
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [isDark, setIsDark] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const obs = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!user) return;
    const key = `notifs_${user.id}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setNotifs(JSON.parse(saved));
    } else {
      const defaults = getDefaultNotifications(
        user.role,
        user.name,
        user.state?.replace(/_/g, " ")?.replace(/\b\w/g, l => l.toUpperCase()) || "your state"
      );
      setNotifs(defaults);
      localStorage.setItem(key, JSON.stringify(defaults));
    }
  }, [user]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const save = (updated: Notification[]) => {
    setNotifs(updated);
    if (user) localStorage.setItem(`notifs_${user.id}`, JSON.stringify(updated));
  };

  const markRead    = (id: string) => save(notifs.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = ()           => save(notifs.map(n => ({ ...n, read: true })));
  const dismiss     = (id: string) => save(notifs.filter(n => n.id !== id));

  const unread = notifs.filter(n => !n.read).length;

  const panelBg     = isDark ? "rgba(15, 23, 42, 0.96)"   : "rgba(255, 255, 255, 0.94)";
  const panelBorder = isDark ? "rgba(255,255,255,0.10)"   : "rgba(255,255,255,0.95)";

  return (
    <div ref={ref} style={{ position: "relative" }}>

      {/* Bell button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="btn-ghost w-9 h-9 !p-0 rounded-xl flex items-center justify-center"
        style={{ color: "var(--text-2)", position: "relative" }}>
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            style={{
              position: "absolute", top: 4, right: 4,
              width: 16, height: 16, borderRadius: "50%",
              background: "#ef4444", color: "white",
              fontSize: 9, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid var(--bg)",
            }}>
            {unread > 9 ? "9+" : unread}
          </motion.span>
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,   scale: 1     }}
            exit={{    opacity: 0, y: -10, scale: 0.97  }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            style={{
              position: "absolute",
              top: "calc(100% + 10px)",
              right: 0,
              width: 340,
              maxWidth: "calc(100vw - 32px)",
              borderRadius: 20,
              zIndex: 200,
              overflow: "hidden",
              background: panelBg,
              backdropFilter: "blur(40px) saturate(2)",
              WebkitBackdropFilter: "blur(40px) saturate(2)",
              border: `1px solid ${panelBorder}`,
              boxShadow: isDark
                ? "0 24px 64px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)"
                : "0 24px 64px rgba(99,120,150,0.22), 0 2px 8px rgba(99,120,150,0.1)",
            }}>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}` }}>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm" style={{ color: "var(--text-1)" }}>Notifications</h3>
                {unread > 0 && <span className="badge badge-green">{unread} new</span>}
              </div>
              {unread > 0 && (
                <button onClick={markAllRead}
                  className="text-xs font-semibold flex items-center gap-1"
                  style={{ color: "var(--green-dark)" }}>
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div style={{ maxHeight: 380, overflowY: "auto" }}>
              {notifs.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <Bell className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--text-3)" }} />
                  <p className="text-sm" style={{ color: "var(--text-3)" }}>All caught up!</p>
                </div>
              ) : notifs.map((n, i) => {
                const meta = iconMap[n.type];
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => markRead(n.id)}
                    className="flex gap-3 px-5 py-3.5 cursor-pointer"
                    style={{
                      background: n.read
                        ? "transparent"
                        : isDark ? "rgba(34,197,94,0.06)" : "rgba(34,197,94,0.05)",
                      borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                      transition: "background 0.15s",
                    }}>

                    <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
                      style={{ background: meta.bg }}>
                      <meta.icon className="w-4 h-4" style={{ color: meta.color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs font-bold leading-tight" style={{ color: "var(--text-1)" }}>
                          {n.title}
                        </p>
                        <button
                          onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                          className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full"
                          style={{ color: "var(--text-3)" }}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-2)" }}>
                        {n.body}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <p className="text-xs" style={{ color: "var(--text-3)" }}>{n.time}</p>
                        {!n.read && (
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: "var(--green-dark)" }} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            {notifs.length > 0 && (
              <div className="px-5 py-3 text-center"
                style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}` }}>
                <button onClick={() => save([])}
                  className="text-xs" style={{ color: "var(--text-3)" }}>
                  Clear all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
