Area	Tool / Servizio

Frontend + Backend	Next.js (App Router)

Creazione del form register/login, con campi dinamici per migliorare la UX,
creazione di un grande schema zod per verificare la validità dei dati inseriti 
creazione dei backend API per la registrazione di nuovi utenti tramite POST con NextResponse

Creazione della sezione prodotti all'interno di user come schermata princiapale. Creazione della logica di aggiungi al carrello con inserimento di prodotto al componente cart


per la gestione acquisti quando clicchiamo su aggiugi al carrello il prodotto viene salvato nel context, e ne aumenta la quantità.
Nella pagina del carrello inoltre, l'utente può aumnetare le quantità dello stesso prodotto, diminuire e eliminarlo. 
E' possibile anche fare il checkout, ma è ancora in fase di sviluppo.
Svuotamento invece cancella i dati del carrello.

si fa anche uso di usereducer che gestisce tutta la logica degli acquisti in un'unica funzione, cosa che con lo useState non si può fare (si poteva optare per Redux, ma ho scelto di migliorare l'utilizzo degli hooks).

Deploy frontend	Vercel

Database Supabase (PostgreSQL)

la creazione degli utenti tramite Prisma e il salvataggio su Supabase avviene tramite la stringa DATABASE_URL con configurazione PostegreSQL

ORM	Prisma

per la parte di prisma ho creato le due tabelle user e product per la creazione in DB di un nuovo utente

Autenticazione NextAuth

Permette agli utenti di loggarsi con email/password ne valida le credenziali contro il database Prisma usa JWT per mantenere l’utente loggato personalizza la sessione con i dati dell’utente reindirizza al login personalizzato se necessario.

Pagamenti Stripe

Storage immagini Supabase Storage



sto realizzando un e-commerce 

lo stack tecnologico è:

nextJS, prisma, nextAuth, supabase e postegreSQL e stripe per pagamenti
ho già creato il login/register con autenticazione e sto creando la sezione prodotti, dove ho tutti i proodtti con pulsante di aggiungi al carrello per aggiungere il prodotto al componente cart

questa è la struttura

/app
  /api
    /auth             → NextAuth
    /products         → CRUD prodotti
    /checkout         → Stripe API
  /cart               → carrello utente
  /admin              → dashboard admin
  /product/[slug]     → dettaglio prodotto
  index.tsx           → homepage con elenco prodotti

/components
  ProductCard.tsx
  CartSidebar.tsx
  Navbar.tsx
  ProductForm.tsx

/prisma
  schema.prisma       → definizione database

/lib
  auth.ts             → helpers per NextAuth
  stripe.ts           → client Stripe

/styles
  tailwind.config.js