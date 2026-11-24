# language: pt
Funcionalidade: Revogar acesso
  Como [administrador](../../ROLES.md#administrador)
  Quero revogar o acesso de um utilizador
  Para que ele deixe de usar a aplicação

  Cenário: O administrador revoga um utilizador com o acesso aprovado
    Dado que existem os utilizadores:
      | nome   | e-mail              | e-mail verificado | acesso   |
      | Helena | helena@exemplo.test | sim               | aprovado |
      | Marta  | marta@exemplo.test  | sim               | aprovado |
    E o administrador é a Helena
    E a Helena tem sessão iniciada
    Quando a Helena revoga a Marta
    Então o acesso da Marta aparece como «revogado» em «Gerir acessos»

  Cenário: O administrador revoga um utilizador com o acesso pendente
    Dado que existem os utilizadores:
      | nome   | e-mail              | e-mail verificado | acesso   |
      | Helena | helena@exemplo.test | sim               | aprovado |
      | Ana    | ana@exemplo.test    | sim               | pendente |
    E o administrador é a Helena
    E a Helena tem sessão iniciada
    Quando a Helena revoga a Ana
    Então o acesso da Ana aparece como «revogado» em «Gerir acessos»

  Cenário: Um utilizador revogado vê a mensagem de revogação no pedido seguinte
    Dado que existem os utilizadores:
      | nome   | e-mail              | e-mail verificado | acesso   |
      | Helena | helena@exemplo.test | sim               | aprovado |
      | Marta  | marta@exemplo.test  | sim               | revogado |
    E o administrador é a Helena
    E a Marta tem uma sessão aberta de antes de o seu acesso ser revogado
    Quando a Marta abre a aplicação
    Então a Marta vê «O seu acesso foi revogado.»
    E a Marta vê «Sair»
