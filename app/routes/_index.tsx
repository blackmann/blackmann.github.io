import type { MetaFunction } from "react-router";
import { Content } from "~/components/content";

export const meta: MetaFunction = () => {
  return [{ title: "Welcome to Greatness" }, { name: "description", content: "Just do it!" }];
};

export default function Index() {
  return <Content>This is the</Content>;
}
