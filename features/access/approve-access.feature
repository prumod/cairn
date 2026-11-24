# language: pt
Funcionalidade: Aprovar acesso
  Como [administrador](../../ROLES.md#administrador)
  Quero aprovar o acesso de um utilizador
  Para que ele possa usar a aplicação

  Cenário: O administrador aprova um utilizador com o acesso pendente
    Dado que existem os utilizadores:
      | nome   | e-mail              | e-mail verificado | acesso   |
      | Helena | helena@exemplo.test | sim               | aprovado |
      | Ana    | ana@exemplo.test    | sim               | pendente |
    E o administrador é a Helena
    E a Helena tem sessão iniciada
    Quando a Helena aprova a Ana
    Então o acesso da Ana aparece como «aprovado» em «Gerir acessos»

  Cenário: O administrador aprova um utilizador com o acesso revogado
    Dado que existem os utilizadores:
      | nome   | e-mail              | e-mail verificado | acesso   |
      | Helena | helena@exemplo.test | sim               | aprovado |
      | Bruno  | bruno@exemplo.test  | sim               | revogado |
    E o administrador é a Helena
    E a Helena tem sessão iniciada
    Quando a Helena aprova o Bruno
    Então o acesso do Bruno aparece como «aprovado» em «Gerir acessos»
