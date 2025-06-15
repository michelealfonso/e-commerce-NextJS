// chiamate API per product

import { NextResponse } from "next/server";
import { clientPrisma } from "@/app/lib/prisma";

//ci serve per verificare se l'endpoint è corretto

export async function GET() {
  try {
    const products = await clientPrisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Errore durante il recupero dei prodotti:", error);
    return NextResponse.json(
      { message: "Errore durante il recupero dei prodotti." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(`dati ricevuti`, body);

    const { name, slug, description, price, imageUrl } = body;

    if (!name || !slug || !description || !price || !imageUrl) {
      console.warn("⚠️ Dati mancanti:", {
        name,
        slug,
        description,
        price,
        imageUrl,
      });
      return NextResponse.json({ message: "Dati mancanti." }, { status: 400 });
    }

    const newProduct = await clientPrisma.product.create({
      data: {
        name,
        slug,
        description,
        price: Number(price),
        imageUrl,
      },
    });

    console.log("Prodotto salvato:", newProduct);

    return NextResponse.json(
      {
        ...newProduct,
        createdAt: newProduct.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something was wrong " },
      { status: 500 }
    );
  }
}
