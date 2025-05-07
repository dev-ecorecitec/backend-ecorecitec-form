- controllers -> onde se se localiza o CRUD de cada etapa da aplicação dos 

- impactos -> CRUD dos impactos

- newsletter -> CRUD do envio de e-mails

- ondefoi -> uso da SISGAIA e sistema de pontos em conjunto com uma automação que recebe dados de outra paltaforma 

- webscraping -> scraping da plataforma do mapbiomas 

- user -> dentro do usuário há a etapa de login (normal, metamask e google) e registro, e na pasta profile, há o CRUD do usuário.

- middleware -> autenticação do usuário e do admin para decisão no frontend de aparecer a opção de "Ligador" no Sidebar da aba do Colaborador no frontend.


## USUÁRIO

- /login -> login do usuário
- /register -> registro do usuário
- /logout -> para o usuário se deslogar
- /auth/google -> login com o google
- /auth/metamask -> login com o metamask
- /user/update -> atualização dos dados do usuário
- /users/profile -> listagem dos dados do usuário específico (pega id via token)
- /users -> listagem de todos os usuários
- /profile/:id -> apagar usuário

## IMPACTOS

- /impacts -> criar impacto
- /impacts/user -> lista de impactos que o usuário fez
- /impacts -> lsita global do usuário (apenas usuários com ADMIN poderão acessar, para isso, - adicione seu email na .env -> AUTHORIZED_EMAILS)
- /impacts/id -> atualizar impacto.

## NEWSLETTER

- /newsletter -> salva o email do usuário na newsletter
- /newsletter/e-mails -> lista dos emaisl da newsletter
- /newsletter/delete -> apaga email da newsletter

## WEBSCRAPING

- /scrape-news -> rota para listagem do conteúdo do webscraping

## OBS: todas as rotas que nã foram listadas ainda estão em andamento/construção

## .ENV BACKEND
está no exemplo .env-example