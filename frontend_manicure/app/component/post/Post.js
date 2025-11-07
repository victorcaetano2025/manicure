"use client";

export default function Post({ title, content, author }) {
  return (
    <div
      style={{
        padding: '16px',
        margin: '12px 0',
        border: '1px solid #ccc',
        borderRadius: '8px',
        backgroundColor: '#f2dede',
        color: '#000',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <h2 style={{ margin: '0 0 8px 0' }}>{title}</h2>
      <p style={{ margin: '0 0 12px 0' }}>{content}</p>
      <small>Por: {author}</small>
    </div>
  );
}
