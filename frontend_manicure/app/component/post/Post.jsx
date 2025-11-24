"use client";

export default function Post({ idPost, titulo, descricao, author, data }) {
  return (
    <div className="p-4 mb-4 text-black border rounded bg-pink-50">
      <h2 className="font-bold text-black text-lg mb-2">{titulo}</h2>
      <p className="text-black mb-2">{descricao}</p>
      <p className="text-black">Por: {author}</p>
      <p>{data}</p>
    </div>
  );
}
