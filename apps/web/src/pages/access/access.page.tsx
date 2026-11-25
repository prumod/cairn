import { useEffect, useState } from "react";
import { authClient } from "./accessAuthClient.js";
import { getMyAccess, type MyAccessView } from "./useCases/getMyAccess/getMyAccess.functions.js";
import { listPeople, type PersonView } from "./useCases/listPeople/listPeople.functions.js";
import { changeAccess } from "./useCases/changeAccess/changeAccess.functions.js";

type View =
  | { kind: "loading" }
  | { kind: "signedOut"; signInFailed: boolean }
  | { kind: "failed" }
  | { kind: "access"; me: MyAccessView };

const statusLabels = { pending: "pendente", approved: "aprovado", revoked: "revogado" } as const;

// Better Auth sends a failed or cancelled Google sign-in back to this page with an `error` query.
function signInFailedFromUrl() {
  return new URLSearchParams(window.location.search).has("error");
}

export function AccessPage() {
  const [view, setView] = useState<View>({ kind: "loading" });

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const session = await authClient.getSession();

        if (!session.data) {
          if (active) setView({ kind: "signedOut", signInFailed: signInFailedFromUrl() });

          return;
        }

        const me = await getMyAccess();

        if (active) setView({ kind: "access", me });
      } catch (error) {
        if (!active) return;

        // The session ended after the page loaded: show the sign-in screen again.
        if (error instanceof Response && error.status === 401)
          setView({ kind: "signedOut", signInFailed: false });
        else setView({ kind: "failed" });
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  async function signIn() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      errorCallbackURL: "/",
    });
  }

  async function signOut() {
    await authClient.signOut();
    setView({ kind: "signedOut", signInFailed: false });
  }

  if (view.kind === "loading")
    return (
      <p className="mb-4 max-w-[48rem] rounded-lg border border-line bg-panel p-5">A carregar…</p>
    );

  if (view.kind === "failed")
    return (
      <p className="mb-4 max-w-[48rem] rounded-lg border border-line bg-panel p-5">
        Não foi possível carregar o seu acesso.
      </p>
    );

  if (view.kind === "signedOut")
    return (
      <section className="mb-4 grid max-w-[48rem] justify-items-start gap-4 rounded-lg border border-line bg-panel p-5">
        {view.signInFailed ? (
          <p role="alert" className="text-danger">
            Não foi possível entrar. Tente outra vez.
          </p>
        ) : null}
        <button
          type="button"
          className="cursor-pointer rounded-md border border-accent bg-accent px-4 py-2 text-onaccent"
          onClick={signIn}
        >
          Entrar com Google
        </button>
      </section>
    );

  const { me } = view;

  if (me.status === "pending")
    return (
      <section className="mb-4 grid max-w-[48rem] justify-items-start gap-4 rounded-lg border border-line bg-panel p-5">
        <p>O seu acesso aguarda aprovação.</p>
        <SignOutButton onSignOut={signOut} />
      </section>
    );

  if (me.status === "revoked")
    return (
      <section className="mb-4 grid max-w-[48rem] justify-items-start gap-4 rounded-lg border border-line bg-panel p-5">
        <p>O seu acesso foi revogado.</p>
        <SignOutButton onSignOut={signOut} />
      </section>
    );

  return (
    <section className="mb-4 grid max-w-[48rem] justify-items-start gap-4 rounded-lg border border-line bg-panel p-5">
      <p>
        Sessão iniciada como {me.name} ({me.email}).
      </p>
      <SignOutButton onSignOut={signOut} />
      {me.administrator ? <ManageAccess currentUserId={me.userId} /> : null}
    </section>
  );
}

function SignOutButton({ onSignOut }: { onSignOut: () => void }) {
  return (
    <button
      type="button"
      className="cursor-pointer rounded-md border border-accent bg-transparent px-4 py-2 text-accent"
      onClick={onSignOut}
    >
      Sair
    </button>
  );
}

function ManageAccess({ currentUserId }: { currentUserId: string }) {
  const [people, setPeople] = useState<PersonView[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    try {
      setPeople(await listPeople());
    } catch {
      setMessage("Não foi possível carregar os acessos.");
    }
  }

  useEffect(() => {
    void load();
    // Loads once when the administrator opens the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function change(userId: string, action: "approve" | "revoke") {
    try {
      await changeAccess({ data: { userId, action } });
      setMessage(null);
      await load();
    } catch {
      setMessage("Não foi possível alterar o acesso.");
    }
  }

  return (
    <section
      className="w-full rounded-lg border border-line bg-panel p-5"
      aria-labelledby="manage-access-title"
    >
      <h2 id="manage-access-title" className="mb-2 text-lg font-semibold">
        Gerir acessos
      </h2>
      {message ? (
        <p role="alert" className="text-danger">
          {message}
        </p>
      ) : null}
      {people === null ? null : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th scope="col" className="border-b border-line p-2 text-left">
                Nome
              </th>
              <th scope="col" className="border-b border-line p-2 text-left">
                E-mail
              </th>
              <th scope="col" className="border-b border-line p-2 text-left">
                Estado
              </th>
              <th scope="col" className="border-b border-line p-2 text-left">
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => {
              const isSelf = person.userId === currentUserId;

              return (
                <tr key={person.userId}>
                  <td className="border-b border-line p-2 text-left">{person.name}</td>
                  <td className="border-b border-line p-2 text-left">{person.email}</td>
                  <td className="border-b border-line p-2 text-left">
                    {statusLabels[person.status]}
                  </td>
                  <td className="border-b border-line p-2 text-left">
                    {isSelf ? null : (
                      <>
                        {person.status === "approved" ? null : (
                          <button
                            type="button"
                            className="cursor-pointer rounded-md border border-accent bg-accent px-4 py-2 text-onaccent"
                            onClick={() => change(person.userId, "approve")}
                          >
                            Aprovar
                          </button>
                        )}
                        {person.status === "revoked" ? null : (
                          <button
                            type="button"
                            className="cursor-pointer rounded-md border border-accent bg-transparent px-4 py-2 text-accent"
                            onClick={() => change(person.userId, "revoke")}
                          >
                            Revogar
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
