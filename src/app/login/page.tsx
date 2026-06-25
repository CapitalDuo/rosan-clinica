import { LoginForm } from './login-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const sp = await searchParams
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundColor: '#1e1b4b',
        backgroundImage: "url('/tela_login_fundo.avif')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <LoginForm next={sp.next ?? '/'} initialError={sp.error} />
    </div>
  )
}
