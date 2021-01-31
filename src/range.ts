export interface TaxMargin {
  percent: number;
  amount: number;
}

export interface TaxResult extends TaxMargin {
  tax: number;
  untaxed: number;
}

class Range {
  protected margins: TaxMargin[] = [];

  public calculateMargin(money: number) {
    return this.margins
      .map(({ percent, amount }, i) => {
        const lastMargin =
          i === 0 ? { percent: 0, amount: 0 } : this.margins[i - 1];
        const taxable = Math.max(
          0,
          Math.min(money - lastMargin.amount, amount - lastMargin.amount)
        );
        const taxed = taxable * percent;

        return {
          percent,
          amount,
          tax: taxed,
          untaxed: taxable - taxed,
        };
      })
      .filter((result) => result.untaxed !== 0);
  }
}

class BCTaxRange extends Range {
  constructor() {
    super();

    this.margins.push({ percent: 0.0506, amount: 42184 });
    this.margins.push({ percent: 0.077, amount: 84369 });
    this.margins.push({ percent: 0.105, amount: 96866 });
    this.margins.push({ percent: 0.1229, amount: 117623 });
    this.margins.push({ percent: 0.147, amount: 159483 });
    this.margins.push({ percent: 0.168, amount: 222420 });
    this.margins.push({ percent: 0.205, amount: Number.MAX_SAFE_INTEGER });
  }
}

class CanadaTaxRange extends Range {
  constructor() {
    super();

    this.margins.push({ percent: 0.15, amount: 49020 });
    this.margins.push({ percent: 0.2, amount: 98040 });
    this.margins.push({ percent: 0.26, amount: 151978 });
    this.margins.push({ percent: 0.29, amount: 216511 });
    this.margins.push({ percent: 0.33, amount: Number.MAX_SAFE_INTEGER });
  }
}

const bcRange = new BCTaxRange();
const canadaRange = new CanadaTaxRange();

export { bcRange, canadaRange };
