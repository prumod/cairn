# language: pt
Funcionalidade: Tornar-se administrador
  Como [utilizador](../../ROLES.md#utilizador)
  Quero que a instalação me reconheça como administrador pelo meu e-mail verificado
  Para poder decidir quem usa a aplicação

  Contexto:
    Dado que o e-mail do administrador da instalação é "helena@exemplo.test"

  Cenário: Um utilizador com o e-mail verificado do administrador torna-se administrador
    Dado que a Helena tem o e-mail verificado "helena@exemplo.test" e nunca entrou
    Quando a Helena entra
    Então a Helena vê «Gerir acessos»
    E o acesso da Helena é «aprovado»

  Cenário: Um utilizador com o e-mail do administrador, mas não verificado, não se torna administrador
    Dado que o Bruno tem o e-mail não verificado "helena@exemplo.test" e nunca entrou
    Quando o Bruno entra
    Então o Bruno vê «O seu acesso aguarda aprovação.»
    Mas o Bruno não vê «Gerir acessos»

  Cenário: Um utilizador com outro e-mail verificado não se torna administrador
    Dado que a Carla tem o e-mail verificado "carla@exemplo.test" e nunca entrou
    Quando a Carla entra
    Então a Carla vê «O seu acesso aguarda aprovação.»
    Mas a Carla não vê «Gerir acessos»
