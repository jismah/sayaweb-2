import Navbar from "./Navbar";
import React, { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
    return (
        <>
            <Navbar />
            <main className="container-global">
                {children}
            </main>
        </>
    )
}

export default Layout;