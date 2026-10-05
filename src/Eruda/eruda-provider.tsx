"use client";

import eruda from "eruda";
import { ReactNode, useEffect } from "react";

export const Eruda = (props: { children: ReactNode }) => {
  useEffect(() => {
    try {
      eruda?.init();
    } catch (error) {
      // eslint-disable-next-line no-empty
    }
  }, []);

  return <>{props.children}</>;
};
