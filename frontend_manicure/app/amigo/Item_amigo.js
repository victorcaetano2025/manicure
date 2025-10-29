import React from "react";
import { useNavigate } from "react-router-dom";

function FriendItem({ friend }) {
    const navigate = useNavigate();

    const statusStyle = {
        color:friend.status === "online" ? "green" : "gray"
    }
    const handleClick = () => {
        navigate(`/friend/${friend.id}` , {state:{ friend } } );
    };

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
        onMouseOver={(e) => (e.curretTarget.style.bakcground = "#f9f9f9")}
        onMouseOut={(e) => (e.currentTarget.style.backgorund = "white")}

      >
        <img
              src={friend.avatrUrl}
              alt={friend.name}
              width={40}
              height={40}
              style={{ borderRaduis: "50%"}}
        />
        <span style={statusStyle}>{friend.name}</span>
       <div/>
     );
   }

    export default FriendItem;