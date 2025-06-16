"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import Navbar from "../components/navbar";
import Products from "../components/products";

export default async function User() {
    const session = await getServerSession(authOptions);

    return (
        <div>
            {!session ? (
                <>
                    <Navbar />
                </>
            ) : (
                <>
                    <Navbar />
                    <Products/>
                </>
            )}
        </div>
    )
}
