"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import Link from "next/link";
import Image from "next/image";
import Cart from "./cart";


export default async function Navbar() {

    const session = await getServerSession(authOptions);

    return (
        <div className="w-full h-auto p-6 flex justify-end items-center gap-5">
            {!session ? (
                <>
                    <Link
                        className="w-auto bg-[#FFD814] hover:bg-amazon-yellow-dark py-1.5 px-4 border border-gray-400 rounded-md text-sm font-medium text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8F00]"
                        href="sign-in">
                        Accedi
                    </Link>
                    <Link
                        href="/cart"
                        className="w-auto flex gap-2 py-1.5 px-4 border  bg-gray-100 hover:bg-gray-200 border-gray-300 rounded-md text-sm font-medium text-gray-800 shadow-sm">
                        <Image src="/icons/cart.svg" alt="" width={20} height={20} />
                        <h1> Cart </h1>
                    </Link>


                </>
            ) : (
                <>
                    <h1> {session.user?.name} </h1>
                    <Link
                        className="w-auto  py-1.5 px-4  bg-[#FFD814] hover:bg-amazon-yellow-dark border border-gray-400 rounded-md text-sm font-medium text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8F00]"
                        href="/sign-in">
                        Logout
                    </Link>
                    <Cart />  
                </>
            )}
        </div >
    )
}
