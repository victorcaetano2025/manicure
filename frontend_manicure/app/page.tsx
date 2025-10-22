// pagina Home onde tudo inicia
import Link from 'next/link';
import Feed from './component/Feed';
import Post from './component/Post';

export default function Home() {
  return (
    <div>
      <header>
        <Link href="/pages/auth">authenticação</Link>
      </header>
      <Post
        title="pintei o simbolo do Xbox"
        content="foto da unha pintada de Xbox"
        author="ricardo"
      />

      <Feed />

      <h1>Bem-vindo à Home</h1>
      <nav>
        <ul>
          <li><Link href="/pages/about">Ir para Sobre</Link></li>
          <li><Link href="/pages/contact">Ir para Contato</Link></li>
        </ul>
      </nav>
    </div>
  );
}
