# Cairn — fontes

Lista das fontes citadas no [glossário](../../GLOSSARY.md) e nos [termos por definir](now/termos-por-definir.md). Para cada fonte indica-se o que é, se é oficial, para que a usamos e o que não foi verificado.

Uma fonte **oficial** é publicada pela entidade que a emite, como o Diário da República. Uma fonte **secundária** reproduz ou resume uma fonte oficial e pode ter erros. Quando uma fonte secundária é usada, é porque a oficial não estava acessível; isso fica indicado.

## Legislação

### Código dos Contratos Públicos (CCP)

- **O que é:** o Decreto-Lei n.º 18/2008, que regula a formação dos contratos públicos, incluindo as empreitadas de obras públicas.
- **Cópia usada:** [texto consolidado até ao DL 78/2022](https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf), publicado pelo Instituto Superior Técnico.
- **Oficial:** não. É uma consolidação não oficial. A versão oficial é a legislação consolidada do Diário da República, que não conseguimos ler (a página precisa de JavaScript).
- **Usada para:** Concurso (art. 16.º e 130.º), Anúncio (art. 130.º), Lote (art. 46.º-A e 73.º), Empreitada e Obra (art. 343.º).
- **Não verificado:** alterações posteriores ao DL 78/2022, além do DL 66/2025, que não altera estes artigos. Que cada lote dá origem à sua própria empreitada é uma inferência dos art. 46.º-A, n.º 5, e 73.º, n.º 2; nenhum artigo o diz com estas palavras.

### Lei n.º 41/2015

- **O que é:** o regime jurídico da atividade da construção. Define o alvará, as categorias, as subcategorias e as classes. Aplica-se a todo o território nacional (art. 2.º).
- **Cópias usadas:**
  - [Página oficial no Diário da República](https://diariodarepublica.pt/dr/detalhe/lei/41-2015-67377968): texto original de 2015.
  - [Legislação consolidada do Diário da República, versão de 14-6-2018](https://www.madeira.gov.pt//Portals/19/Documentos/Legislacao/Lei_41.2015_Consolidada_2018_Atividade_Constru%C3%A7%C3%A3o.pdf): exportação do Diário da República (INCM), alojada no site do Governo Regional da Madeira. Inclui a alteração da Lei n.º 25/2018. Usamo-la porque tem números de página.
- **Oficial:** sim, nas duas cópias. A segunda é texto oficial alojado por terceiros.
- **Usada para:** Alvará, Categoria, Subcategoria e Classe (art. 3.º, 6.º, 8.º e 53.º).
- **Não verificado:** alterações posteriores a 2018. O anexo I, com a lista das categorias e subcategorias, não está na versão consolidada («ver documento original»); a lista está a ser investigada em [Which categorias and subcategorias does annex I of Lei 41/2015 list?](https://github.com/prumod/cairn/issues/159).

### Portaria n.º 212/2022

- **O que é:** a portaria que fixa os valores máximos de obra de cada uma das 9 classes do alvará. Publicada no Diário da República, 1.ª série, n.º 162, de 23-8-2022; em vigor desde 24-8-2022.
- **Cópia usada:** [resumo da Cuatrecasas, p. 2](https://www.cuatrecasas.com/resources/legal-flash-portaria-212-2022-atualizacao-valores-classes-alvaras-construcao-630e35547c5cc454220208.pdf#page=2), uma sociedade de advogados.
- **Oficial:** não. É uma fonte secundária. A cópia da portaria no portal BASE falhou a verificação do certificado TLS, e não desativámos essa verificação.
- **Usada para:** os valores das classes, nos termos por definir.
- **Não verificado:** os valores contra o texto oficial da portaria.

## Anúncios do Diário da República

- **O que são:** os PDF dos anúncios da Série II, Parte L, em `files.diariodarepublica.pt`.
- **Oficial:** sim.
- **Usados para:** medir quantos concursos de empreitadas têm lotes e como o anúncio os descreve. Exemplos: [Gebalis, 6 lotes em freguesias diferentes](https://files.diariodarepublica.pt/cp_hora/2026/06/109/419963726.pdf) e [Universidade de Aveiro, 4 lotes com CPV diferentes](https://files.diariodarepublica.pt/cp_hora/2026/05/104/419962843.pdf).
- **Não verificado:** a amostra cobre 16 números semanais, de 8-5-2026 a 25-8-2026; setembro e outubro de 2026 não foram amostrados.

## Entrevistas

- **O que são:** as transcrições [T1](transcriptions/transcricao1_gestao_obras.md), [T2](transcriptions/transcricao2_gestao_obras.txt) e [T3](transcriptions/transcricao_3_gestao_obras.txt), com o utilizador.
- **Oficial:** não se aplica. São a fonte da linguagem e das necessidades do utilizador, não de regras jurídicas.
- **Usadas para:** Raio de pesquisa e Localização da empresa (T3).
- **Limites:** são textos revistos com trechos incertos. Quando contradizem a lei, prevalece a lei. Por exemplo, a T3 indica classes de 1 a 5, mas a Portaria n.º 212/2022 fixa 9.

## Decisões da equipa

Alguns termos não têm fonte externa porque são decisões de produto: Empresa e Perfil da empresa. Estão registados nas decisões do [mapa de Now](https://github.com/prumod/cairn/issues/141).
