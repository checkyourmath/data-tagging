const PREFIX = '[Data Tagging]';

export class AddLog {
  public static readonly type = `${PREFIX} Add Log`;
  constructor(public params: { message: string }) {}
}
