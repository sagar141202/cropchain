import confetti from "canvas-confetti";

export const burstConfetti = () => {
  // Centre burst
  confetti({
    particleCount: 120,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#22c55e", "#16a34a", "#bbf7d0", "#6366f1", "#f59e0b", "#ffffff"],
    ticks: 200,
  });

  // Left cannon
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ["#22c55e", "#dcfce7", "#f59e0b", "#6366f1"],
      ticks: 180,
    });
  }, 120);

  // Right cannon
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ["#22c55e", "#dcfce7", "#f59e0b", "#6366f1"],
      ticks: 180,
    });
  }, 240);
};

export const firstProposalConfetti = () => {
  // Extra big burst for first ever proposal
  confetti({
    particleCount: 200,
    spread: 90,
    origin: { y: 0.55 },
    colors: ["#22c55e", "#16a34a", "#bbf7d0", "#6366f1", "#f59e0b", "#ec4899", "#ffffff"],
    ticks: 300,
    scalar: 1.2,
  });

  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.6 },
      colors: ["#22c55e", "#f59e0b", "#ec4899"],
      ticks: 250,
    });
  }, 150);

  setTimeout(() => {
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.6 },
      colors: ["#22c55e", "#f59e0b", "#6366f1"],
      ticks: 250,
    });
  }, 300);

  // Star shapes trail
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 360,
      startVelocity: 20,
      origin: { y: 0.5 },
      ticks: 200,
      shapes: ["star"],
      colors: ["#f59e0b", "#fbbf24", "#fef3c7"],
      scalar: 1.4,
    });
  }, 500);
};

export const firstInvestmentConfetti = () => {
  // Gold/money themed burst for investor
  confetti({
    particleCount: 180,
    spread: 80,
    origin: { y: 0.55 },
    colors: ["#f59e0b", "#fbbf24", "#fef3c7", "#6366f1", "#22c55e", "#ffffff"],
    ticks: 280,
    scalar: 1.1,
  });

  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.6 },
      colors: ["#f59e0b", "#6366f1", "#22c55e"],
      ticks: 220,
    });
  }, 150);

  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.6 },
      colors: ["#f59e0b", "#6366f1", "#22c55e"],
      ticks: 220,
    });
  }, 300);

  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 360,
      startVelocity: 15,
      origin: { y: 0.45 },
      ticks: 180,
      shapes: ["star"],
      colors: ["#f59e0b", "#fbbf24"],
      scalar: 1.6,
    });
  }, 450);
};
