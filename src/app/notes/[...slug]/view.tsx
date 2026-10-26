"use client";
import React from "react";
import { useEffect } from "react";

const ReportView: React.FC<{ slug: string }> = ({ slug }) => {
  useEffect(() => {
    fetch("/api/increment", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ slug }),
    });
  }, [slug]);
  return <div />;
};

export default ReportView;
