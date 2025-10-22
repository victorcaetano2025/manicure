import Link from 'next/link';
import Cadastrar from '../../component/cadastrar';


export default function Auth() {
    return (
        <div>
            <h1>Sobre nós</h1>
            <Link href="/">Voltar para Home</Link>
            <div style={{
                background: 'gray',
                padding: '20px',
                borderRadius: '8px'
            }}>
                <Cadastrar />
            </div>
        </div>
    );
}