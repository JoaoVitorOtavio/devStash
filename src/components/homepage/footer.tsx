import Link from "next/link";
import { Code } from "lucide-react";

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card/40 px-6 pt-16">
      <div className="mx-auto grid max-w-6xl gap-10 border-b border-border pb-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-mono text-primary">
              <Code className="h-4 w-4" />
            </span>
            DevStash
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">Store Smarter. Build Faster.</p>
        </div>

        {FOOTER_COLUMNS.map(({ title, links }) => (
          <div key={title}>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {title}
            </h4>
            <ul className="space-y-2">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-sm hover:text-primary">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="py-6 text-center text-sm text-muted-foreground">
        &copy; {year} DevStash. All rights reserved.
      </p>
    </footer>
  );
}
