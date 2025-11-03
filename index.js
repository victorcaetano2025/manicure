fetch("http://localhost:8080/usuarios", {
  method: "GET",
  headers: {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYXJpYUBnbWFpbC5jb20iLCJpYXQiOjE3NjIxOTc5ODYsImV4cCI6MTc2MjIwMTU4Nn0._BChjpca1-4pjPLf-MvzV3pgB14qvs9kdWcowlh7IhI",
    "Content-Type": "application/json"
  }
})
  .then(response => {
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return response.json();
  })
  .then(data => console.log("Usuários:", data))
  .catch(err => console.error("Erro na requisição:", err));
