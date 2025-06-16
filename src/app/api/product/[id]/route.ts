import { NextResponse } from "next/server";
import { clientPrisma } from "@/app/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const product = await clientPrisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      // Se product è null, restituisci 404
      return NextResponse.json(
        { message: "Prodotto non trovato" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      ...product,
      createdAt: product.createdAt.toISOString(),
        _source: "local",
    });
  } catch (error) {
    console.error("Errore nella lettura del prodotto:", error);
    return NextResponse.json(
      { 
        message: "Errore interno del server",
        error: error instanceof Error ? error.message : String(error),
      },
      
      { status: 500 }
    );
  }
}
