import { Code, Sparkles, Search, Terminal, File, Folder, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollReveal } from "@/components/homepage/scroll-reveal";
import { ITEM_TYPE_PALETTE } from "@/components/homepage/item-type-palette";

interface Feature {
  title: string;
  description: string;
  Icon: LucideIcon;
  color: string;
}

const FEATURES: Feature[] = [
  {
    title: "Code Snippets",
    description: "Save and organize reusable code with full syntax highlighting for any language.",
    Icon: Code,
    color: ITEM_TYPE_PALETTE.snippet.color,
  },
  {
    title: "AI Prompts",
    description: "Keep your best prompts and workflows ready to reuse across every project.",
    Icon: Sparkles,
    color: ITEM_TYPE_PALETTE.prompt.color,
  },
  {
    title: "Instant Search",
    description: "Full-text search across content, tags, titles, and types — find anything in seconds.",
    Icon: Search,
    color: "#06b6d4",
  },
  {
    title: "Commands",
    description: "Never Google that flag again — stash the terminal commands you actually use.",
    Icon: Terminal,
    color: ITEM_TYPE_PALETTE.command.color,
  },
  {
    title: "Files & Docs",
    description: "Upload images, templates, and reference docs alongside the code they belong with.",
    Icon: File,
    color: ITEM_TYPE_PALETTE.file.color,
  },
  {
    title: "Collections",
    description: "Group mixed item types into collections — React Patterns, Python Snippets, and more.",
    Icon: Folder,
    color: "#6366f1",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mx-auto max-w-xl text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Everything in one stash</h2>
          <p className="mt-3 text-muted-foreground">
            One searchable hub for every kind of developer knowledge.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ title, description, Icon, color }, i) => (
            <ScrollReveal key={title} delay={i * 75}>
              <Card
                className="h-full p-7 transition-transform hover:-translate-y-1"
                style={{ borderTop: `3px solid ${color}` }}
              >
                <div
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${color}26`, color }}
                >
                  <Icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
