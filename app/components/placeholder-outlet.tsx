import type React from "react";
import { useOutlet } from "react-router";

interface Props extends React.PropsWithChildren {}
export function PlaceholderOutlet({ children }: Props) {
  const outlet = useOutlet();

  if (!outlet) return children;

  return outlet;
}
