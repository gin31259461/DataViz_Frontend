import { LinearProgress } from '@mui/material';

interface LinearProgressPendingProps {
  isPending?: boolean;
}

export default function LinearProgressPending(
  props: LinearProgressPendingProps,
) {
  return <>{props.isPending && <LinearProgress color="info" />}</>;
}
