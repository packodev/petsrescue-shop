"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { emptyCart } from "@/app/cart/actions";

export function ClearCartOnMount() {
  const router = useRouter();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;
    void emptyCart().then(() => router.refresh());
  }, [router]);

  return null;
}
