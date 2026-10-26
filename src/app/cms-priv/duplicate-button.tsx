"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuCopy, LuLoaderCircle } from "react-icons/lu";

interface DuplicateButtonProps {
  adminPath: string;
  slug: string;
  type: string;
}

export default function DuplicateButton({ adminPath, slug, type }: DuplicateButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDuplicate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/${adminPath}/duplicate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug }),
      });
      const data = await res.json();

      if (data.success) {
        router.push(`/${adminPath}/${data.type}/${data.slug}`);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDuplicate}
      disabled={loading}
      aria-label="Duplicate"
      title="Duplicate"
      className="text-gray-500 hover:text-white hover:cursor-pointer transition-colors disabled:opacity-50"
    >
      {loading ? <LuLoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <LuCopy className="w-3.5 h-3.5" />}
    </button>
  );
}
