import * as React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { TaxResult } from "../../range";

export interface Props {
  taxes: TaxResult[];
}

export function RangeTable(props: Props) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tax Margin</TableCell>
            <TableCell>Subject to Tax</TableCell>
            <TableCell>Tax Percentage</TableCell>
            <TableCell>Tax Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.taxes.map((result, i) => (
            <TableRow>
              <TableCell>
                ${i === 0 ? 0 : props.taxes[i - 1].amount} - $
                {props.taxes[i].amount}
              </TableCell>
              <TableCell>${(result.tax + result.untaxed).toFixed(2)}</TableCell>
              <TableCell>{result.percent * 100}%</TableCell>
              <TableCell>${result.tax.toFixed(2)}</TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell rowSpan={1} />
            <TableCell colSpan={1}>
              <Typography>
                <Box fontWeight={500}>Total Tax</Box>
              </Typography>
            </TableCell>
            <TableCell>
              $
              {props.taxes
                .reduce((acc, current) => (acc += current.tax), 0)
                .toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
