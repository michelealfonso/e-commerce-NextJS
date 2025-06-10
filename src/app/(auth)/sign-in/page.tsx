"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from "react";
import { signIn } from "next-auth/react";

const fullSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must have at least 8 characters'),
  name: z.string().min(2, { message: 'Il nome è obbligatorio' }).optional(),
  confirmPassword: z.string().min(6, { message: 'Minimo 6 caratteri' }).optional(),
}).refine((data) => {
  if (data.name && data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  path: ['confirmPassword'],
  message: 'Le password non coincidono',
});

export default function AmazonStyleAuthForm() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formError, setFormError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof fullSchema>>({
    resolver: zodResolver(fullSchema),
  });

  const onSubmit = async (data: z.infer<typeof fullSchema>) => {
     setFormError('');

  if (isRegistering) {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const { error } = await response.json();
      setFormError(error || 'Errore durante la registrazione');
      return;
    }
  }

  const result = await signIn('credentials', {
    email: data.email,
    password: data.password,
    redirect: false,
  });

  if (result?.error) {
    setFormError('Email o password errati');
  } else {
    router.push('/user');
  }
  };

  const toggleForm = () => {
    setIsRegistering(prev => !prev);
    setFormError('');
    reset();
  };

  return (
    <div className="max-w-sm mx-auto mt-4 p-6 border border-gray-300 rounded-md bg-white">
      {/* Logo Amazon (sostituisci con il tuo) */}
      <div className="flex justify-center mb-6">
        <div className="text-3xl font-semibold text-amazon-primary">Il Tuo Logo</div>
      </div>

      <div className="border border-gray-300 rounded-md p-4">
        <h1 className="text-2xl font-medium mb-4">
          {isRegistering ? 'Crea account' : 'Accedi'}
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amazon-orange focus:border-[#FF8F00]"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amazon-orange focus:border-[#FF8F00]"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amazon-orange focus:border-[#FF8F00]"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Conferma password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amazon-orange focus:border-[#FF8F00]"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FFD814] hover:bg-amazon-yellow-dark py-1.5 px-4 border border-gray-400 rounded-md text-sm font-medium text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF8F00]"
          >
            {isSubmitting ? 'Caricamento...' : isRegistering ? 'Crea il tuo account M-shop' : 'Accedi'}
          </button>
        </form>

        <div className="text-xs mt-4 text-gray-500">
          <p>Accedendo, accetti le nostre Condizioni di vendita. Consulta la nostra Informativa sulla privacy, la nostra Informativa sui Cookie e la nostra Informativa sulla Pubblicità definita in base agli interessi.</p>
        </div>
      </div>

      <div className="mt-4 text-center text-sm">
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-gray-500"> Nuovo su M-Shop?</span>
          </div>
        </div>

        <button
          onClick={toggleForm}
          className="w-full bg-gray-100 hover:bg-gray-200 py-1.5 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-800 shadow-sm"
        >
          {isRegistering ? 'Hai già un account? Accedi' : 'Crea il tuo account M-Shop'}
        </button>
      </div>
    </div>
  );
}