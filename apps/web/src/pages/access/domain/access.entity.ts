export const accessStatuses = ["pending", "approved", "revoked"] as const;

export type AccessStatus = (typeof accessStatuses)[number];

export type AccessRefusalReason = "selfChange" | "administratorRequired";

export class AccessRefusal extends Error {
  constructor(readonly reason: AccessRefusalReason) {
    super("Access change refused: " + reason);
  }
}

// One person's access to the application. The id is the person's user id.
export class Access {
  constructor(
    readonly userId: string,
    readonly administrator: boolean,
    readonly status: AccessStatus,
    readonly companyId: string,
  ) {}

  // Two accesses are the same when they belong to the same person.
  equals(other: Access) {
    return this.userId === other.userId;
  }

  get approved() {
    return this.status === "approved";
  }

  approve(by: Access) {
    return this.changeStatus("approved", by);
  }

  revoke(by: Access) {
    return this.changeStatus("revoked", by);
  }

  private changeStatus(status: AccessStatus, by: Access) {
    if (by.equals(this)) throw new AccessRefusal("selfChange");

    if (!by.administrator || !by.approved) throw new AccessRefusal("administratorRequired");

    return new Access(this.userId, this.administrator, status, this.companyId);
  }
}
