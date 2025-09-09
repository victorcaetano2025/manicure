# [Manicure](README.md)/ROTAS
projeto Java spring boot com maven e postgresSql sendo essa a parte da API onde vai ocorrer a comunicação via metodos HTTP

## Rotas CRUD e logic

## GET
`http://localhost:8080/usuarios` ou `usuarios/id`
<br>`http://localhost:8080/posts` ou `posts/id`
<br>`http://localhost:8080/agendamentos`
## POST
- ### como fazer um post na tabela usuario<br>
`{ "nome": "nome",
 "idade": 18,
  "email": "seu_email",
  "senha": "sua_senha",
  "urlFotoPerfil": "URL_foto",
  "sexo": "F" ou "M",
  "especialidade": "alguma_especialidade",
  "regiao": "algum_lugar" }`
- ### como fazer um post na tabela post<br>
`{
  "titulo": "titulo da postagem",
  "descricao": "testo que aparecera logo em baixo",
  "author": {
    "idUsuario": id author(quem fez)
  }
}`
- ### como fazer um post na tabela agendamento
`{
  "manicure": {
    "idUsuario": id_da_manicure
  },
  "usuario": {
    "idUsuario": id_do_cliente
  },
  "descricao": "Unha decorada com esmalte vermelho",
  "data": "dd/mm/yyyy",
  "hora": "hh:mm",
  "status": "AGENDADO" ou "CANCELADO" ou "CONCLUIDO",
  "valor": 00.0
}`
## PUT
- ### usuarios<br>
#### `http://localhost:8080/usuarios/id`<br>
`{
  "titulo": "Novo título do post",
  "descricao": "Atualizei o conteúdo do post",
  "author": {
    "idUsuario": 1
  }
}`
- ### posts<br>
#### `http://localhost:8080/posts/id`<br>
`{
  "nome": "João Silva",
  "idade": 30
}`

## DELETE
- #### `http://localhost:8080/usuarios/id`
- #### `http://localhost:8080/posts/id`