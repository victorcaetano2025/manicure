# manicure
projeto para website 

## GET
- #### `http://localhost:8080/usuarios` ou `usuarios/id`
- #### `http://localhost:8080/posts` ou `posts/id`

## POST
- ### como fazer um post na tabela usuario<br>
`{
  "nome": "meu nome",
  "idade": 18
}`
- ### como fazer um post na tabela post<br>
`{
  "titulo": "titulo da postagem",
  "descricao": "testo que aparecera logo em baixo",
  "author": {
    "idUsuario": id author(quem fez)
  }
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