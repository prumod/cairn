# language: pt
Funcionalidade: Sair
  Como [utilizador](../../ROLES.md#utilizador)
  Quero sair da minha conta
  Para que a minha conta não fique aberta neste navegador

  Cenário: Um utilizador sai
    Dado que a Ana tem o e-mail verificado "ana@exemplo.test" e o acesso pendente
    E a Ana tem sessão iniciada
    Quando a Ana sai
    Então a Ana vê «Entrar com Google»
