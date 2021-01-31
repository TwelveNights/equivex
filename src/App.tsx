import { Container, Typography } from "@material-ui/core";
import React from "react";
import { Range } from "./features/range/Range";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Container>
          <Typography variant="h3">RRSP Returns Calculator</Typography>
          <Range />
        </Container>
      </header>
    </div>
  );
}

export default App;
