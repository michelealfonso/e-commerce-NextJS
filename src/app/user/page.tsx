"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import Navbar from "../components/navbar";
import Products from "../components/products";
import { redirect } from "next/navigation";

export default async function User() {
    const session = await getServerSession(authOptions);

    if(!session) {
        redirect('/sign-in')
    }

    return (
        <div>
            <>
                <Navbar />
                <Products />
            </>

        </div>
    )
}
