import { clientPrisma } from "@/app/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try{
    const { email, name, password } = await request.json();

  // controlliamo se effettivamente l'utente esiste

  const exsistingUser = await clientPrisma.user.findUnique({
    where: { email: email },
  });

  if (exsistingUser) {
    return NextResponse.json(
      {
        user: null,
        message: "User with this email already exists",
      },
      { status: 409 }
    );
  }

  const exsistingUserByName = await clientPrisma.user.findFirst({
    where: { name: name },
  });

  if (exsistingUserByName) {
    return NextResponse.json(
      { user: null, message: "User with this username already exists" },
      { status: 409 }
    );
  }

    const hashedPassword = await hash(password, 10);
    const newUser = await clientPrisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword
        }
    })

     const { password: newUserPassword , ...rest } = newUser;
        return NextResponse.json({ user: newUser , message: 'User created successfully' }, { status: 201 });
  }
  catch(error) {
      return NextResponse.json({ message: 'Something was wrong '}, { status: 500 })
  }
}


`
Questo codice è un endpoint API POST che gestisce la registrazione di un nuovo utente. Ecco cosa fa in breve:

Prende email, nome e password dalla richiesta

Verifica se esiste già un utente con la stessa email o username

Se esiste, restituisce un errore 409 (Conflitto)

Se non esiste, cripta la password e crea un nuovo utente nel database

Restituisce i dati dell'utente (senza password) con status 201 (Creato)

Gestisce eventuali errori con una risposta 500 (Errore server)

In sintesi: è un endpoint per la registrazione utente con validazioni e sicurezza base.
`