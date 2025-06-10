"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { cookies } from "next/headers";
import Link from "next/link";
import { useRouter } from "next/router";
import Navbar from "../components/navbar";
import Product from "../product/page";

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
                    <p>Qui puoi vedere i prodotti disponibili...</p>
                    <Product />
                    {/* qui inserisco product */}
                    {/* <Link href="/sign-in"> Logout </Link> */}
                </>
            )}
        </div>
    )
}
