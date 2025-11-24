fetch("http://localhost:8080/usuarios", {
  method: "GET",
  headers: {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtYXJpYUB0ZXN0ZS5jb20iLCJpYXQiOjE3NjM5MzA0MTgsImV4cCI6MTc2MzkzNDAxOH0.hjFdunzzkJIhYtLB6n6jGf9YEjDB_D_f-E15zl9XFLo",
    "Content-Type": "application/json"
  }
})
  .then(response => {
    if (!response.ok) throw new Error(`Erro ${response.status}`);
    return response.json();
  })
  .then(data => console.log("Usuários:", data))
  .catch(err => console.error("Erro na requisição:", err));
