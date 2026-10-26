"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuLoaderCircle, LuTrash2, LuX } from "react-icons/lu";

interface DeleteButtonProps {
  adminPath: string;
  slug: string;
  type: string;
}

export default function DeleteButton({ adminPath, slug, type }: DeleteButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/${adminPath}/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, slug }),
      });
      const data = await res.json();

      if (data.success) {
        setOpen(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        disabled={loading}
        aria-label="Delete"
        title="Delete"
        className="text-gray-500 hover:text-red-500 hover:cursor-pointer transition-colors disabled:opacity-50"
      >
        {loading ? <LuLoaderCircle className="w-3.5 h-3.5 animate-spin" /> : <LuTrash2 className="w-3.5 h-3.5" />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => !loading && setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-[#2a2a2a] bg-[#111] p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold font-rethink text-lg">Delete Draft</h2>
              <button
                type="button"
                onClick={() => !loading && setOpen(false)}
                className="text-gray-500 hover:text-white"
              >
                <LuX className="h-5 w-5" />
              </button>
            </div>

            <p className="text-sm text-gray-300">
              Delete <span className="font-semibold text-white">{slug}</span>? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="rounded-lg border border-[#3a3a3a] px-4 py-2 text-sm text-gray-400 transition-colors hover:border-[#5a5a5a] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
