import React from 'react';

import { Container, Typography} from '@material-ui/core';
import Box from '@material-ui/core/Box';

import Link from '../components/Link';


export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="body1" component="h6" gutterBottom>
          <Link href="/counter" color="secondary">
            Go to the search page
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}