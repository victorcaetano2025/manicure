// pagina Home onde tudo inicia
import Link from 'next/link';

export default function Home() {
  return (

    <div>
      <header>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/cadastro">Cadastro</Link>
      </header>
      <h1>Bem-vindo à Home</h1>
      <nav>
        <ul>
          <li><Link href="/about">Ir para Sobre</Link></li>
          <li><Link href="/contact">Ir para Contato</Link></li>
        </ul>
      </nav>
    </div>
  );
}
