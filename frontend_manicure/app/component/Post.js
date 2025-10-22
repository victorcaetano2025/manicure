"use client";

export default function Post({ title, content, author }) {
    return (
        <div style={{
            padding: '12px',
            margin: '8px',
            border: '1px solid #ffffffff',
            borderRadius: '8px',
            backgroundColor: '#ddb0b0ff',
            color: 'black',
            height: '20%',
            width: '40%'
        }}>
            <h2>{title}</h2>
            <p>{content}</p>
            <small>Por: {author}</small>
        </div>
    );
}
