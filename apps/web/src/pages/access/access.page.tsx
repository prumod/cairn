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

  if (view.kind === "loading") return <p className="access-message">A carregar…</p>;

  if (view.kind === "failed")
    return <p className="access-message">Não foi possível carregar o seu acesso.</p>;

  if (view.kind === "signedOut")
    return (
      <section className="access-panel">
        {view.signInFailed ? <p role="alert">Não foi possível entrar. Tente outra vez.</p> : null}
        <button type="button" className="access-button" onClick={signIn}>
          Entrar com Google
        </button>
      </section>
    );

  const { me } = view;

  if (me.status === "pending")
    return (
      <section className="access-panel">
        <p>O seu acesso aguarda aprovação.</p>
        <SignOutButton onSignOut={signOut} />
      </section>
    );

  if (me.status === "revoked")
    return (
      <section className="access-panel">
        <p>O seu acesso foi revogado.</p>
        <SignOutButton onSignOut={signOut} />
      </section>
    );

  return (
    <section className="access-panel">
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
    <button type="button" className="access-button access-button--secondary" onClick={onSignOut}>
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
    <section className="access-manage" aria-labelledby="manage-access-title">
      <h2 id="manage-access-title">Gerir acessos</h2>
      {message ? <p role="alert">{message}</p> : null}
      {people === null ? null : (
        <table>
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">E-mail</th>
              <th scope="col">Estado</th>
              <th scope="col">Ação</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => {
              const isSelf = person.userId === currentUserId;

              return (
                <tr key={person.userId}>
                  <td>{person.name}</td>
                  <td>{person.email}</td>
                  <td>{statusLabels[person.status]}</td>
                  <td>
                    {isSelf ? null : (
                      <>
                        {person.status === "approved" ? null : (
                          <button
                            type="button"
                            className="access-button"
                            onClick={() => change(person.userId, "approve")}
                          >
                            Aprovar
                          </button>
                        )}
                        {person.status === "revoked" ? null : (
                          <button
                            type="button"
                            className="access-button access-button--secondary"
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
