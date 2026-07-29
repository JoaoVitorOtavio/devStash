"use client";

import { useEffect, useRef } from "react";
import { LayoutGrid, GitBranch, MessageSquare, Code, AppWindow, Terminal, FileText, Bookmark } from "lucide-react";
import { cn } from "@/server/utils";

const CHAOS_ICONS = [
  { label: "Notion", Icon: LayoutGrid },
  { label: "GitHub", Icon: GitBranch },
  { label: "Slack", Icon: MessageSquare },
  { label: "VS Code", Icon: Code },
  { label: "Browser Tabs", Icon: AppWindow },
  { label: "Terminal", Icon: Terminal },
  { label: "Text File", Icon: FileText },
  { label: "Bookmark", Icon: Bookmark },
];

const ICON_SIZE = 46;
const REPEL_RADIUS = 90;

interface Particle {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  pulsePhase: number;
}

export function ChaosVisual() {
  const boxRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    const bounds = box.getBoundingClientRect();
    const width = bounds.width || 300;
    const height = bounds.height || 320;

    const particles: Particle[] = iconRefs.current
      .filter((el): el is HTMLDivElement => el !== null)
      .map((el) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.3 + Math.random() * 0.35;
        return {
          el,
          x: Math.random() * Math.max(width - ICON_SIZE, 1),
          y: Math.random() * Math.max(height - ICON_SIZE, 1),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 0.3,
          pulsePhase: Math.random() * Math.PI * 2,
        };
      });

    function handleMouseMove(e: MouseEvent) {
      const rect = box!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function handleMouseLeave() {
      mouseRef.current = { x: -9999, y: -9999 };
    }
    box.addEventListener("mousemove", handleMouseMove);
    box.addEventListener("mouseleave", handleMouseLeave);

    let frame = 0;
    let animationId: number;

    function tick() {
      frame++;
      const { x: mouseX, y: mouseY } = mouseRef.current;
      // Re-measure every frame (not just once at mount) so the walls stay
      // correct across viewport/window resizes instead of icons drifting
      // past a container that has since shrunk.
      const currentBounds = box!.getBoundingClientRect();
      const width = currentBounds.width || 300;
      const height = currentBounds.height || 320;

      particles.forEach((p) => {
        // Constant drift — never damped, so icons keep floating forever
        // instead of freezing in place after the first second.
        p.x += p.vx;
        p.y += p.vy;

        // Mouse repel: a one-off positional nudge for this frame only.
        // Doesn't touch p.vx/p.vy, so speed never ratchets up on repeated
        // hovers and icons resume their normal drift once the cursor leaves.
        const dx = p.x + ICON_SIZE / 2 - mouseX;
        const dy = p.y + ICON_SIZE / 2 - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < REPEL_RADIUS) {
          const force = (REPEL_RADIUS - dist) / REPEL_RADIUS;
          p.x += (dx / (dist || 1)) * force * 4;
          p.y += (dy / (dist || 1)) * force * 4;
        }

        // Bounce off walls (reflect the constant drift heading, don't kill it)
        if (p.x <= 0) { p.x = 0; p.vx = Math.abs(p.vx); }
        if (p.x >= width - ICON_SIZE) { p.x = width - ICON_SIZE; p.vx = -Math.abs(p.vx); }
        if (p.y <= 0) { p.y = 0; p.vy = Math.abs(p.vy); }
        if (p.y >= height - ICON_SIZE) { p.y = height - ICON_SIZE; p.vy = -Math.abs(p.vy); }

        p.rotation += p.rotSpeed;
        const scale = 1 + Math.sin(frame * 0.02 + p.pulsePhase) * 0.08;

        p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rotation}deg) scale(${scale})`;
      });

      animationId = requestAnimationFrame(tick);
    }
    animationId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationId);
      box.removeEventListener("mousemove", handleMouseMove);
      box.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className="relative h-[320px] overflow-hidden rounded-2xl border border-border bg-card/60"
    >
      {CHAOS_ICONS.map(({ label, Icon }, i) => (
        <div
          key={label}
          ref={(el) => { iconRefs.current[i] = el; }}
          title={label}
          className={cn(
            "absolute flex h-[46px] w-[46px] items-center justify-center rounded-lg",
            "border border-border bg-card text-muted-foreground will-change-transform"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      ))}
    </div>
  );
}
