export interface Erc20 {
  totalSupply();
  balanceOf(who: string);
  transfer(sender: string, to: string, value: number);
  allowance(owner: string, spender: string);
  approve(sender: string, spender: string, value: number);
  transferFrom(sender: string, from: string, to: string, value: number);
}