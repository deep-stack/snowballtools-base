// import { useEffect, useState } from 'react';
// import { snowball } from './snowball';

// export function useSnowball() {
//   const [state, setState] = useState(100);

//   useEffect(() => {
//     // Subscribe and directly return the unsubscribe function
//     return snowball.subscribe(() => setState(state + 1));
//   }, [snowball]);

//   return snowball;
// }
