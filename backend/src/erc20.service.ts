export interface Erc20Service {
  transfer(to: string, value: number);
  balanceOf(who: string);
  totalSupply();
  allowance(owner: string, spender: string);
  approve(spender: string, value: number);
  transferFrom(from: string, to: string, value: number);
}