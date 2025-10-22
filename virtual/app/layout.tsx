import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Asistente de Triage Quilpué',
  description: 'Orientación no clínica para decidir dónde consultar (UEH/SAR/SAPU/APS) con IA y motor ESI simplificado.',
  manifest: '/manifest.webmanifest'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="container py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Asistente de Triage Quilpué</h1>
            <a className="small underline" href="tel:131">Emergencia 131 (SAMU)</a>
          </div>
          <p className="small opacity-70 mt-1">Este asistente es orientativo y no reemplaza una evaluación profesional. Si presenta signos de alarma, acuda a Urgencia Hospitalaria o llame al 131.</p>
        </header>
        <main className="container pb-24">{children}</main>
      </body>
    </html>
  )
}
