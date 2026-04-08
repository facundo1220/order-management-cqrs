export class RemoveProductCommand {
  constructor(
    public readonly orderId: string,
    public readonly productId: string,
  ) {}
}
