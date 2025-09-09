# [Manicure](README.md)/LOGIN
projeto Java spring boot com maven e postgresSql sendo essa a parte da API onde vai ocorrer a comunicação via metodos HTTP

## Login e register para autenticação

`http://localhost:8080/auth/` `register` ou `login`
### register - json
auth sem complento<br>
`{
  "nome": "nome",
  "idade": 18,
  "email": "seu_email",
  "senha": "sua_senha",
  "urlFotoPerfil": "URL_foto",
  "sexo": "F" ou "M"
}`

auth com complento<br>
`{
  "nome": "nome",
  "idade": 18,
  "email": "seu_email",
  "senha": "sua_senha",
  "urlFotoPerfil": "URL_foto",
  "sexo": "F" ou "M",
  "especialidade": "alguma_especialidade",
  "regiao": "algum_lugar"
}`

### login - json
`{
  "email": "seu_email",
  "senha": "sua_senha"
}`