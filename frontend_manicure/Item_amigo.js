import React from "react";
import { useNavigate } from"react-router-dom";

function FriendItem({ friend }) {
    const navigate = useNavigate();

    const statusStyle = {
        color:friend.status === "online" ? "green" : "gray"
    }
    
    const handleClick = () => {
        navigate(`/friend/${friend.id , { state: { friend } } );

        return (
        <div
        
        onClick={handleClick}
        style={{
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "8px",
        display: "flex",
        alignItems:"center",
        gap: "10px",
        cursor: "pointer",
        transition: "background 0.3s",
        }}
        onMouseOver={(e) => (e.curretTarget.style.bakcground = #f9f9f9 )}
        onMouseOut={(e) => (e.currenrTarget.style.backgorund = "white")}
        >
        <img
        src
    