"use client";

import { store } from "@/store";
import type { PropsWithChildren } from "react";
import { Provider } from "react-redux";

type LayoutContentType = PropsWithChildren<{}>;

export default function LayoutContent({ children }: LayoutContentType) {
    return <Provider store={store}>{children}</Provider>;
}
