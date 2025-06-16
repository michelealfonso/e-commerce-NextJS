"use client";

export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface SessionData {
  id: string,
  amount_total: number,
  customer_details?: {
    email: string
  }
}

export default function CheckoutClient() {

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const params = useSearchParams();
  const sessionId = params.get('session_id');

  useEffect(() => { 
    const fetchCheckoutData = async () => {
      if (sessionId) {
        try {
          const response = await fetch(`/api/checkout?session_id=${sessionId}`)
          const data = await response.json();
          setSessionData(data);
        }
        catch (error) {
          console.error(error)
        }
      }
    }
    fetchCheckoutData();
  }, [sessionId])

  if (!sessionData) {
    return <p>Caricamento dati pagamento...</p>;
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">Pagamento completato!</h1>
  <p className="text-gray-700 mb-2">ID sessione: {sessionData.id}</p>
      <p className="text-gray-700 mb-2">Totale: ${(sessionData.amount_total / 100).toFixed(2)}</p>
      <p className="text-gray-700">Email: {sessionData.customer_details?.email}</p>
    </div>
  );
}
