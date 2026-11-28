# language: pt
Funcionalidade: Tema e páginas legais
  Como [utilizador](../../ROLES.md#utilizador)
  Quero ver a aplicação no tema claro ou escuro e encontrar a política de privacidade e os termos de utilização em qualquer página
  Para que a aplicação se leia como escolhi e as condições estejam sempre à mão

  Esquema do Cenário: Sem escolha guardada, a aplicação segue a preferência do sistema
    Dado que o sistema da Ana prefere o tema <preferência>
    E a Ana ainda não escolheu um tema
    Quando a Ana abre a aplicação
    Então a Ana vê o tema <tema>

    Exemplos:
      | preferência | tema   |
      | claro       | claro  |
      | escuro      | escuro |

  Cenário: Sem escolha guardada, a aplicação acompanha uma mudança do sistema
    Dado que o sistema da Ana prefere o tema claro
    E a Ana ainda não escolheu um tema
    E a Ana está na página inicial
    Quando o sistema da Ana passa a preferir o tema escuro
    Então a Ana vê o tema escuro

  Cenário: Mudar o tema aplica-o de imediato
    Dado que o sistema da Ana prefere o tema claro
    E a Ana ainda não escolheu um tema
    E a Ana está na página inicial
    Quando a Ana muda o tema
    Então a Ana vê o tema escuro

  Cenário: A escolha guardada mantém-se depois de recarregar a aplicação
    Dado que o sistema da Ana prefere o tema claro
    E a Ana escolheu o tema escuro
    Quando a Ana recarrega a aplicação
    Então a Ana vê o tema escuro
    E a Ana não vê a página no tema claro, nem por um instante

  Esquema do Cenário: Sem sessão iniciada, a política de privacidade e os termos estão no rodapé de <página>
    Dado que a Ana não tem sessão iniciada
    Quando a Ana abre <página>
    Então a Ana vê «Política de privacidade» no rodapé
    E a Ana vê «Termos de utilização» no rodapé

    Exemplos:
      | página                    |
      | a aplicação               |
      | a política de privacidade |
      | os termos de utilização   |

  Esquema do Cenário: Com sessão iniciada e o acesso pendente, a política de privacidade e os termos estão no rodapé de <página>
    Dado que a Ana tem o e-mail verificado "ana@exemplo.test" e o acesso pendente
    E a Ana tem sessão iniciada
    Quando a Ana abre <página>
    Então a Ana vê «Política de privacidade» no rodapé
    E a Ana vê «Termos de utilização» no rodapé

    Exemplos:
      | página                    |
      | a aplicação               |
      | a política de privacidade |
      | os termos de utilização   |

  Cenário: Sem sessão iniciada, a Ana abre os termos de utilização a partir do rodapé
    Dado que a Ana não tem sessão iniciada
    E a Ana está na página inicial
    Quando a Ana segue «Termos de utilização» no rodapé
    Então a Ana está na página «Termos de utilização»
