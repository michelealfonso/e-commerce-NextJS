import { Suspense } from "react";
import CheckoutClient from "../components/checkoutClient";

export const dynamic = "force-dynamic";

export default function Checkout() {
  return (
    <Suspense fallback={<p>Caricamento...</p>}>
      <CheckoutClient />
    </Suspense>
  );
}