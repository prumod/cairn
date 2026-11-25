# language: pt
Funcionalidade: Escolher o tema
  Como [utilizador](../../ROLES.md#utilizador)
  Quero escolher entre o tema claro e o escuro
  Para ler a aplicação com o aspeto que me é mais confortável

  Cenário: Alternar para o tema escuro
    Dado que o sistema prefere o tema claro
    Quando se abre a aplicação sem escolha de tema
    E se ativa o tema escuro
    Então o tema da página é escuro

  Cenário: Alternar de volta para o tema claro
    Dado que o sistema prefere o tema escuro
    Quando se abre a aplicação sem escolha de tema
    E se ativa o tema claro
    Então o tema da página é claro

  Cenário: A escolha mantém-se depois de recarregar a página
    Dado que o sistema prefere o tema claro
    Quando se abre a aplicação sem escolha de tema
    E se ativa o tema escuro
    E se recarrega a página
    Então o tema da página é escuro

  Cenário: A escolha prevalece sobre a preferência do sistema
    Dado que o sistema prefere o tema escuro
    E que o tema claro foi escolhido
    Quando se abre a aplicação
    Então o tema da página é claro

  Esquema do Cenário: Sem escolha, a página segue a preferência do sistema
    Dado que o sistema prefere o tema <preferência>
    Quando se abre a aplicação sem escolha de tema
    Então o tema da página é <preferência>

    Exemplos:
      | preferência |
      | claro       |
      | escuro      |

  Cenário: A página não mostra o tema errado antes de aparecer
    Dado que o sistema prefere o tema claro
    E que o tema escuro foi escolhido
    Quando se abre a aplicação
    Então o tema escuro estava definido antes do primeiro desenho da página

  Cenário: A Ana vê as páginas legais sem ter sessão
    Quando a Ana abre a aplicação
    Então a Ana vê «Política de privacidade»
    E a Ana vê «Termos de utilização»

  Cenário: A Marta vê as páginas legais com sessão iniciada
    Dado que a Marta tem o e-mail verificado "marta@exemplo.test" e o acesso aprovado
    E a Marta tem sessão iniciada
    Então a Marta vê «Política de privacidade»
    E a Marta vê «Termos de utilização»

  Cenário: A política de privacidade abre-se a partir de outra página legal
    Quando a Ana abre a aplicação
    E a Ana segue a ligação «Termos de utilização»
    E a Ana segue a ligação «Política de privacidade»
    Então a Ana está em «/privacy»
