# language: pt
Funcionalidade: Entrar
  Como [utilizador](../../ROLES.md#utilizador)
  Quero entrar com a minha conta
  Para poder aceder à aplicação

  Cenário: Um utilizador que nunca entrou aguarda aprovação
    Dado que a Ana tem o e-mail verificado "ana@exemplo.test" e nunca entrou
    Quando a Ana entra
    Então a Ana vê «O seu acesso aguarda aprovação.»
    E a Ana vê «Sair»
    Mas a Ana não vê «Gerir acessos»

  Cenário: Um utilizador com o acesso pendente continua a aguardar aprovação
    Dado que o Bruno tem o e-mail verificado "bruno@exemplo.test" e o acesso pendente
    Quando o Bruno entra
    Então o Bruno vê «O seu acesso aguarda aprovação.»
    E o Bruno vê «Sair»
    Mas o Bruno não vê «Gerir acessos»

  Cenário: Um utilizador com o acesso revogado vê que o acesso foi revogado
    Dado que a Carla tem o e-mail verificado "carla@exemplo.test" e o acesso revogado
    Quando a Carla entra
    Então a Carla vê «O seu acesso foi revogado.»
    E a Carla vê «Sair»
    Mas a Carla não vê «Gerir acessos»

  Cenário: Um utilizador aprovado entra sem ver a lista de acessos
    Dado que a Marta tem o e-mail verificado "marta@exemplo.test" e o acesso aprovado
    Quando a Marta entra
    Então a Marta vê «Sair»
    Mas a Marta não vê «Gerir acessos»
