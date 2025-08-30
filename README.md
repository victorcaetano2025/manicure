# manicure
projeto para website 

## GET
`http://localhost:8080/usuarios` ou `usuarios/id`
<br>`http://localhost:8080/posts` ou `posts/id`
<br>`http://localhost:8080/auth` ou `/register`
<br>`http://localhost:8080/agendamentos`

## POST
- ### como fazer um post na tabela usuario<br>
`{
  "nome": "noem",
  "idade": 18,
  "senha": "12345",
  "email": "email@email.com",
  "urlFotoPerfil": "URL para algum ponto",
  "sexo": "F ou M"
}`
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
  "data": "yyyy-mm-dd",
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