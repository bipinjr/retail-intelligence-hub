import { Factory, ShoppingBag } from "lucide-react";

export const RoleBadge = ({ role }: { role: "producer" | "consumer" }) => {
  const isProducer = role === "producer";
  const Icon = isProducer ? Factory : ShoppingBag;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider border ${
        isProducer
          ? "bg-primary/15 text-primary-glow border-primary/40"
          : "bg-accent/15 text-accent border-accent/40"
      }`}
    >
      <Icon className="w-3 h-3" />
      {isProducer ? "Producer · Manufacturer" : "Consumer · Shopper"}
    </span>
  );
};
