/**
 * 高级路由封装
 */
import React from "react";
import { Suspense } from "react";
import { HashRouter, Redirect, Route, Switch } from "react-router-dom";
import KeepAlive from 'react-activation';
import UserConfirmation from "@/components/UserConfirmation";
// import Loading from "@/home/Loading";
import type { DataRouteItem } from "./data";
// 导出
export default function RouterView(props: { routes: DataRouteItem[] }) {
    const { routes } = props
    return <Suspense fallback={<div />}>
        <HashRouter getUserConfirmation={(message, callback) => UserConfirmation(message, callback)}>
            <Switch>
                {
                    routes.map((route: DataRouteItem) => {
                        if (route.redirect) {
                            return (
                                <Route key={route.path} path={route.path} exact={route.exact}>
                                    <Redirect to={route.redirect} />
                                </Route>
                            )
                        } else {
                            return <Route key={route.path}
                                path={route.path}
                                exact={route.exact}
                                render={(prop: any) => {
                                    return (
                                        <KeepAlive saveScrollPosition="screen" when={route?.KeepAlive ? route?.KeepAlive : false}>
                                            <route.component {...prop} />
                                        </KeepAlive>
                                    )
                                }}
                            />
                        }
                    })}
            </Switch>
        </HashRouter>
    </Suspense>
}
