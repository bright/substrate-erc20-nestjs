export interface Erc20 {
  totalSupply();
  balanceOf(who: string);
  transfer(to: string, value: number);
  allowance(owner: string, spender: string);
  approve(spender: string, value: number);
  transferFrom(from: string, to: string, value: number);
}