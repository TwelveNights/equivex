import * as React from "react";
import {
  createStyles,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import { bcRange, canadaRange } from "../../range";
import { RangeTable } from "./RangeTable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(1),
    },
    element: {
      margin: theme.spacing(2),
    },
    input: {
      margin: theme.spacing(1),
      width: "25ch",
    },
  })
);

export function Range() {
  const [amount, setAmount] = useState(0);
  const [rrsp, setRRSP] = useState(0);

  const classes = useStyles();

  const validatedAmount = isNaN(amount) ? 0 : amount;
  const validatedRRSP = isNaN(rrsp) ? 0 : rrsp;

  const canadaTaxes = canadaRange.calculateMargin(validatedAmount);
  const bcTaxes = bcRange.calculateMargin(validatedAmount);

  const postContributionAmount = validatedAmount - validatedRRSP;

  const rrspCanadaTaxes = canadaRange.calculateMargin(postContributionAmount);
  const rrspBCTaxes = bcRange.calculateMargin(postContributionAmount);

  let bcMarginalTaxRate = 0;
  let canadaMarginalTaxRate = 0;
  let rrspBCMarginalTaxRate = 0;
  let rrspCanadaMarginalTaxRate = 0;

  const bcTaxAmount = bcTaxes.reduce((acc, curr) => acc + curr.tax, 0);
  const canadaTaxAmount = canadaTaxes.reduce((acc, curr) => acc + curr.tax, 0);
  const rrspBCTaxAmount = rrspBCTaxes.reduce((acc, curr) => acc + curr.tax, 0);
  const rrspCanadaTaxAmount = rrspCanadaTaxes.reduce(
    (acc, curr) => acc + curr.tax,
    0
  );

  const bcDelta = bcTaxAmount - rrspBCTaxAmount;
  const canadaDelta = canadaTaxAmount - rrspCanadaTaxAmount;

  if (canadaTaxes.length !== 0) {
    canadaMarginalTaxRate = canadaTaxes[canadaTaxes.length - 1].percent;
  }

  if (bcTaxes.length !== 0) {
    bcMarginalTaxRate = bcTaxes[bcTaxes.length - 1].percent;
  }

  if (rrspCanadaTaxes.length !== 0) {
    rrspCanadaMarginalTaxRate =
      rrspCanadaTaxes[rrspCanadaTaxes.length - 1].percent;
  }

  if (rrspBCTaxes.length !== 0) {
    rrspBCMarginalTaxRate = rrspBCTaxes[rrspBCTaxes.length - 1].percent;
  }

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.valueAsNumber);
  };

  const handleChangeRRSP = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRRSP(event.target.valueAsNumber);
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.element} variant="h5">
        Parameters
      </Typography>
      <TextField
        className={classes.input}
        type="number"
        value={amount}
        onChange={handleChangeAmount}
        label="Taxable Income"
        inputProps={{
          min: 0,
          max: Number.MAX_SAFE_INTEGER,
        }}
      />
      <TextField
        className={classes.input}
        type="number"
        value={rrsp}
        onChange={handleChangeRRSP}
        label="RRSP Contribution"
        inputProps={{
          min: 0,
          max: validatedAmount,
        }}
      />

      <Typography className={classes.element} variant="h5">
        Contribution Summary
      </Typography>
      <Typography>
        Contributing ${validatedRRSP} will drop your taxable income to $
        {postContributionAmount}. Your BC tax rate will{" "}
        {bcMarginalTaxRate === rrspBCMarginalTaxRate
          ? "not reduce"
          : `reduce from ${bcMarginalTaxRate * 100}% to ${
              rrspBCMarginalTaxRate * 100
            }%`}
        . Your Canada tax rate will{" "}
        {canadaMarginalTaxRate === rrspCanadaMarginalTaxRate
          ? "not reduce"
          : `reduce from from ${canadaMarginalTaxRate * 100}% to ${
              rrspCanadaMarginalTaxRate * 100
            }%`}
        . You will save ${bcDelta.toFixed(2)} in total BC taxes and $
        {canadaDelta.toFixed(2)} in total Canadian taxes, for a total of $
        {(canadaDelta + bcDelta).toFixed(2)}.
      </Typography>
      <Typography className={classes.element} variant="h5">
        Canada Taxes
      </Typography>
      <RangeTable taxes={canadaTaxes}></RangeTable>
      <Typography className={classes.element} variant="h5">
        BC Taxes
      </Typography>
      <RangeTable taxes={bcTaxes}></RangeTable>
    </div>
  );
}
