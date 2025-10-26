import React from "react";
import { UseNavigate } from"react-router-dom";

function FriendItem({ friend }) {
    const navigate = useNavigate();

    const statusStyle = {
        color:friend.status === "online" ? "green" : "gray"
    }
    
    const handleClick = () => {
        navigate(`/friend/${friend.id , { state: { friend } } } );
        };

        return (
        <div
        
        onCLick={handleClick})
        style={{
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "8px",
        display: "flex",
        alignItems:"center",
        gap: "10" px,
        cursor: "pointer",
        transition: "background 0.3s",
        }}
        onMouseOver={(e => )}
        }}
    }