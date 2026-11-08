# Cairn — descoberta e preparação de propostas (Now)

Vocabulário do percurso de descoberta, preparação e submissão de propostas.

## Termos definidos

**Empresa**:
A organização que usa o Cairn para descobrir concursos e preparar propostas. Não é a entidade adjudicante.
_Evitar_: cliente, organização

**Perfil da empresa**:
Os dados da empresa que a descoberta usa como referência: nome, morada, localização da empresa, alvará (as subcategorias e a classe de cada uma) e raio de pesquisa.
_Evitar_: perfil de referência da empresa, referência da empresa

**Localização da empresa**:
O ponto a partir do qual se medem as distâncias e se traça o raio de pesquisa.
_Evitar_: localização de referência
_Fonte_: [T3 [01:15:58]](docs/product/transcriptions/transcricao_3_gestao_obras.txt#L393)

**Raio de pesquisa**:
A distância em linha reta a partir da localização da empresa que limita a descoberta. Não é trajeto, tempo de deslocação nem distrito.
_Evitar_: raio, zona, área de atuação
_Fonte_: [T3 [00:07:52]](docs/product/transcriptions/transcricao_3_gestao_obras.txt#L95), [T3 [01:15:53]](docs/product/transcriptions/transcricao_3_gestao_obras.txt#L391)

**Concurso**:
O procedimento, publicado em um ou mais anúncios, que põe à concorrência uma ou mais empreitadas. Na lei e nos anúncios, o termo geral é «procedimento», e o concurso público é um dos seus tipos; no Cairn, «concurso» designa qualquer procedimento publicado na 2.ª série, Parte L, do Diário da República.
_Evitar_: procedimento, obra (no sentido de concurso), oportunidade
_Fonte_: [CCP, art. 16.º, n.º 1 (tipos de procedimento), p. 24](https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf#page=24); [CCP, art. 130.º (publicação por anúncio), p. 77](https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf#page=77)

**Anúncio**:
Uma publicação no Diário da República sobre um concurso. A alteração de um anúncio, incluindo a retificação de um erro, publica outro anúncio completo do mesmo concurso, que identifica o anúncio que altera.
_Evitar_: concurso (no sentido de publicação), declaração de retificação, aviso de prorrogação
_Fonte_: [CCP, art. 130.º, p. 77](https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf#page=77); [Portaria n.º 318-A/2023, art. 7.º, n.os 1 e 2, pp. 3–4](https://www.base.gov.pt/Base4/media/zc2fe1uw/portaria-318-a_2023_anuncios.pdf#page=3)

**Alteração do anúncio**:
Um anúncio novo e completo do mesmo concurso que substitui o anterior e diz que secções mudaram e porquê. A retificação de um erro é uma alteração.
_Evitar_: retificação (no sentido de qualquer alteração), declaração de retificação, aviso de prorrogação
_Fonte_: [Portaria n.º 318-A/2023, art. 7.º, n.os 1 e 2, pp. 3–4](https://files.diariodarepublica.pt/1s/2023/10/20701/0000200016.pdf#page=3); [Anexo I, secção 31 (Alteração/anulação), p. 11](https://files.diariodarepublica.pt/1s/2023/10/20701/0000200016.pdf#page=11)

**Recolha**:
A leitura automática, pelo Cairn, dos anúncios que o Diário da República publica numa data. Cada data de publicação tem uma recolha, com um de quatro estados: correu com concursos, correu sem concursos, falhou ou ainda não correu. Uma recolha que falhou não é uma data sem concursos.
_Evitar_: scraping, importação, sincronização

**Prazo de entrega**:
A data e a hora limite para apresentar propostas, tal como as indica o anúncio mais recente do concurso. Uma proposta apresentada depois desse instante é excluída. Não é o prazo de execução.
_Evitar_: prazo de submissão, data de entrega (sem a hora)
_Fonte_: [CCP, art. 146.º, n.º 2, alínea a), p. 82](https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf#page=82); [CCP, art. 470.º, n.º 3, p. 189](https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf#page=189)

**Valor anunciado**:
O preço base sem IVA de um lote, tal como o anúncio o indica: o máximo que a entidade adjudicante aceita pagar por esse lote. Não é o valor do contrato adjudicado nem o custo da empresa.
_Evitar_: valor da obra, preço base, custo

**Estado do concurso**:
Se o prazo de entrega de um concurso já passou: «Aberto» enquanto não passou, «Prazo terminado» depois, e «Prazo não indicado» quando o anúncio não o indica. Depois do prazo, o procedimento continua; só terminou o prazo de entrega.
_Evitar_: concurso fechado, concurso encerrado, concurso ativo, concurso aberto (no sentido de concurso em consulta)

**Concelho**:
A divisão administrativa onde se executa uma obra, abaixo do distrito e acima da freguesia. «Município de Lisboa» designa a entidade adjudicante, não o território.
_Evitar_: município (no sentido de território)
_Fonte_: [Portaria n.º 318-A/2023, Anexo I, 9.6 Concelho, p. 7](https://files.diariodarepublica.pt/1s/2023/10/20701/0000200016.pdf#page=7)

**Freguesia**:
A divisão administrativa abaixo do concelho. No anúncio, «Freguesia: Todas» indica que a obra não está numa só freguesia do concelho.
_Fonte_: [Portaria n.º 318-A/2023, Anexo I, 9.7 Freguesia, p. 7](https://files.diariodarepublica.pt/1s/2023/10/20701/0000200016.pdf#page=7)

**Local da execução**:
Onde se executa a obra de um lote, tal como o anúncio o indica: distrito, concelho e freguesia. Um lote pode ter mais de um. O campo de texto livre «Localidade» do anúncio não faz parte dele, e cidade ou vila também não: não são divisões administrativas.
_Evitar_: localidade, localização da obra
_Fonte_: [Portaria n.º 318-A/2023, Anexo I, secção 9, p. 7](https://files.diariodarepublica.pt/1s/2023/10/20701/0000200016.pdf#page=7)

**Entidade adjudicante**:
A entidade pública que abre o concurso e adjudica as empreitadas, por exemplo um município, um instituto público ou um ramo das Forças Armadas. A sua morada no anúncio não é o local onde a obra se executa.
_Evitar_: cliente, entidade
_Fonte_: [CCP, art. 2.º (entidades adjudicantes), p. 15](https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf#page=15); [Portaria n.º 318-A/2023, Anexo I, secção 1, p. 5](https://files.diariodarepublica.pt/1s/2023/10/20701/0000200016.pdf#page=5) e [secção 9, p. 7](https://files.diariodarepublica.pt/1s/2023/10/20701/0000200016.pdf#page=7)

**Lote**:
Uma parte de um concurso que dá origem à sua própria empreitada. Um concurso sem lotes tem um único lote.
_Fonte_: [CCP, art. 46.º-A, n.º 1, p. 40](https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf#page=40); [n.º 5, p. 41](https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf#page=41); [art. 73.º, n.º 2, p. 55](https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf#page=55). Que cada lote dá a sua própria empreitada é uma inferência destes artigos.

**Empreitada**:
O contrato para executar uma obra.
_Evitar_: obras (como tipo de contrato), contrato de obras
_Fonte_: [CCP, art. 343.º, n.º 1, p. 152](https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf#page=152)

**Obra**:
O trabalho de construção, reparação ou demolição de um imóvel que uma empreitada executa. Uma obra pode estar repartida por vários lotes, e um lote pode abranger várias obras.
_Evitar_: concurso, lote
_Fonte_: [CCP, art. 343.º, n.º 2, p. 152](https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf#page=152)

**Alvará**:
A autorização do IMPIC que habilita uma empresa a executar obras nas subcategorias que lista, cada uma até ao valor da sua classe.
_Evitar_: licença, certificado (é outra autorização, de âmbito mais limitado)
_Fonte_: [Lei n.º 41/2015](https://diariodarepublica.pt/dr/detalhe/lei/41-2015-67377968), art. 3.º, alínea a), e art. 6.º, n.º 2 ([legislação consolidada do Diário da República, versão de 14-6-2018, pp. 3 e 5](https://www.madeira.gov.pt//Portals/19/Documentos/Legislacao/Lei_41.2015_Consolidada_2018_Atividade_Constru%C3%A7%C3%A3o.pdf#page=3))

**Categoria**:
Um grupo de subcategorias do alvará que reúne obras ou trabalhos especializados do mesmo género, por exemplo Edifícios e património construído. Cada lote tem uma categoria: a da sua obra principal.
_Evitar_: tipo de obra
_Fonte_: [Lei n.º 41/2015](https://diariodarepublica.pt/dr/detalhe/lei/41-2015-67377968), art. 3.º, alínea c) ([legislação consolidada do Diário da República, versão de 14-6-2018, p. 3](https://www.madeira.gov.pt//Portals/19/Documentos/Legislacao/Lei_41.2015_Consolidada_2018_Atividade_Constru%C3%A7%C3%A3o.pdf#page=3)); a lista das categorias está no anexo I do [texto original](https://diariodarepublica.pt/dr/detalhe/lei/41-2015-67377968)

**Subcategoria**:
Uma divisão de uma categoria. É a unidade que o alvará lista e a que atribui uma classe.
_Fonte_: [Lei n.º 41/2015](https://diariodarepublica.pt/dr/detalhe/lei/41-2015-67377968), art. 3.º, alínea q), e art. 6.º, n.º 2 ([legislação consolidada do Diário da República, versão de 14-6-2018, pp. 4 e 5](https://www.madeira.gov.pt//Portals/19/Documentos/Legislacao/Lei_41.2015_Consolidada_2018_Atividade_Constru%C3%A7%C3%A3o.pdf#page=4))

**Subcategoria principal**:
A subcategoria que o anúncio exige na classe correspondente ao valor global da obra. O concorrente tem de a ter no seu próprio alvará; as outras subcategorias exigidas, na classe do valor dos seus trabalhos, podem ser cobertas por um subempreiteiro.
_Evitar_: subcategoria única, categoria principal
_Fonte_: Portaria n.º 372/2017, art. 3.º, n.os 1 e 2; [CCP, art. 81.º, n.º 2](https://nca.tecnico.ulisboa.pt/files/sites/35/ccp_vdl_78_2022.pdf); resumo em [lote-subcategorias](https://github.com/prumod/cairn/blob/research/lote-subcategorias/docs/research/lote-subcategorias.md)

**Classe**:
O escalão do valor máximo das obras que a empresa pode executar numa subcategoria do alvará.
_Evitar_: classe da empresa (o alvará atribui uma classe a cada subcategoria, não à empresa)
_Fonte_: [Lei n.º 41/2015](https://diariodarepublica.pt/dr/detalhe/lei/41-2015-67377968), art. 3.º, alínea e), art. 6.º, n.º 2, e art. 8.º ([legislação consolidada do Diário da República, versão de 14-6-2018, pp. 3, 5 e 6](https://www.madeira.gov.pt//Portals/19/Documentos/Legislacao/Lei_41.2015_Consolidada_2018_Atividade_Constru%C3%A7%C3%A3o.pdf#page=3)); valores das 9 classes: Portaria n.º 212/2022 ([resumo da Cuatrecasas, p. 2](https://www.cuatrecasas.com/resources/legal-flash-portaria-212-2022-atualizacao-valores-classes-alvaras-construcao-630e35547c5cc454220208.pdf#page=2))

**Filtro**:
Um critério que restringe os lotes listados: distância, data de publicação, prazo de entrega, estado do concurso, valor anunciado, entidade adjudicante, categoria ou local. Os filtros aplicam-se a todas as vistas e nunca escondem um lote marcado com ⚠. O filtro de local faz-se a partir da seleção de locais.
_Fonte_: [T3 [01:06:57]](docs/product/transcriptions/transcricao_3_gestao_obras.txt#L345), [T3 [01:30:40]](docs/product/transcriptions/transcricao_3_gestao_obras.txt#L503); [PRD #104](https://github.com/prumod/cairn/issues/104), histórias 10–19 e regra 14; [Which PRD #104 audit findings change Now?](https://github.com/prumod/cairn/issues/191)

**Seleção**:
Os lotes ou os locais que a pessoa marca para agir sobre eles: comentar, abrir, comparar ou filtrar por esses locais. Selecionar não muda os lotes listados. A seleção de lotes e a de locais são separadas, e qualquer ação sobre uma seleção esvazia-a.
_Evitar_: escolha (no sentido de seleção), marcação, filtro (no sentido de seleção)
_Fonte_: [PRD #104](https://github.com/prumod/cairn/issues/104), histórias 24–27 e regras 2 e 3; [Which PRD #104 audit findings change Now?](https://github.com/prumod/cairn/issues/191)

**Assistente**:
O agente da descoberta a quem a pessoa pede, em linguagem natural, o que pode fazer na página; responde em texto e mostra os passos que deu.
_Evitar_: agente, chatbot, inteligência artificial
_Fonte_: [T3 [01:28:08]](docs/product/transcriptions/transcricao_3_gestao_obras.txt#L495); [What does the assistant do, and how does it understand requests?](https://github.com/prumod/cairn/issues/172)

**Contexto da conversa**:
Os comentários e as citações, da pessoa ou do assistente, que seguem com os pedidos de uma conversa. Os lotes só selecionados não fazem parte dele.
_Evitar_: contexto (sem mais), seleção (no sentido de contexto)

**Contexto por enviar**:
Os comentários e as citações preparados que ainda não seguiram com um pedido. São da pessoa, só ela os vê, e mantêm-se ao recarregar a página e numa «Nova conversa». Só eles se editam ou apagam.
_Evitar_: rascunho, itens para enviar
_Fonte_: [PRD #104](https://github.com/prumod/cairn/issues/104), história 32 e regra 19; [Where do unsent comments and citations live?](https://github.com/prumod/cairn/issues/200)

**Reverter**:
Editar uma mensagem da pessoa e voltar a enviá-la: o texto da mensagem volta ao campo do pedido e os seus comentários e citações voltam ao contexto por enviar; as mensagens seguintes apagam-se, com tudo o que seguiu com elas e com os comentários e as citações que o assistente escreveu nas respostas apagadas. Não desfaz as alterações de dados.
_Evitar_: desfazer (no sentido de reverter), rollback
_Fonte_: [PRD #104](https://github.com/prumod/cairn/issues/104), história 46 e regra 18; [Where do unsent comments and citations live?](https://github.com/prumod/cairn/issues/200)

O estatuto de cada fonte (oficial ou não, versão e limites) está em [Fontes](docs/product/fontes.md).

Os termos em aberto estão nos termos por definir de [Now](docs/product/now/termos-por-definir.md) e de [Later](docs/product/later/termos-por-definir.md).
