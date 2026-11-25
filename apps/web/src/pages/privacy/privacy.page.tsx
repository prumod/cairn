export function PrivacyPage() {
  return (
    <section className="max-w-[48rem]">
      <h1 className="mb-4 text-2xl font-bold">Política de privacidade</h1>
      <h2 className="mt-6 mb-2 text-lg font-semibold">Dados de início de sessão</h2>
      <p className="mb-3 max-w-[68ch]">
        O Cairn usa o Better Auth com o Google para iniciar sessão. Os registos de autenticação
        incluem um identificador de utilizador, o ID da conta Google, o nome, o endereço de e-mail e
        uma imagem de perfil, quando disponível.
      </p>
      <p className="mb-3 max-w-[68ch]">
        A sessão é mantida por cookies. Os registos de sessão incluem uma data de validade e podem
        incluir o endereço IP e o agente do utilizador.
      </p>
      <h2 className="mt-6 mb-2 text-lg font-semibold">Perfil e aprovação de acesso</h2>
      <p className="mb-3 max-w-[68ch]">
        Utilizadores aprovados podem guardar um perfil da empresa com nome, morada e raio de
        pesquisa em quilómetros.
      </p>
      <p className="mb-3 max-w-[68ch]">
        O Cairn guarda o estado de aprovação e a indicação de administrador de cada conta. O acesso
        aos dados do perfil depende do estado de aprovação; um administrador pode aprovar ou revogar
        o acesso.
      </p>
      <h2 className="mt-6 mb-2 text-lg font-semibold">Armazenamento</h2>
      <p className="mb-3 max-w-[68ch]">
        O código guarda os registos de autenticação, sessão, aprovação e perfil numa base de dados
        PostgreSQL através do cliente Neon HTTP. A aplicação corre num Cloudflare Worker e liga-se à
        base de dados configurada.
      </p>
      <h2 className="mt-6 mb-2 text-lg font-semibold">Utilização e diagnóstico</h2>
      <p className="mb-3 max-w-[68ch]">
        Na versão de produção, o Cairn usa o PostHog na União Europeia para registar a abertura do
        perfil e as tentativas e resultados de gravação. Um identificador técnico liga estes eventos
        à conta, sem enviar o nome ou a morada da empresa nos eventos.
      </p>
      <p className="mb-3 max-w-[68ch]">
        As gravações de sessão ocultam texto, campos e atributos dos elementos. O Cairn não envia
        corpos ou cabeçalhos de pedidos nem registos da consola do navegador nas gravações.
        Identificadores de pedidos e registos técnicos no Cloudflare ajudam a investigar falhas.
      </p>
    </section>
  );
}
