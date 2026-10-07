"use client";

import { useEffect } from "react";
import { recordRecent } from "../../lib-shop/recent";

export default function TrackRecent({ card }) {
  useEffect(() => {
    recordRecent(card);
  }, [card]);
  return null;
}
