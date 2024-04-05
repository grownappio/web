import React, { ReactNode } from "react";

export type DataRouteItem = {
  path: string;
  exact: boolean;
  component: React.FC<Props>;
  children?: DataRouteChildrenItem[];
  redirect?: string;
  KeepAlive?: boolean;
  bg?: string;
  tab?: boolean;
  icon?: string;
  icon1?: string;
  title?: ReactNode;
}

export type DataRouteChildrenItem = {
  path: string;
  component: React.FC<Props>;
}