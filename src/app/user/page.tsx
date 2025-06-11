"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { cookies } from "next/headers";
import Link from "next/link";
import { useRouter } from "next/router";
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
