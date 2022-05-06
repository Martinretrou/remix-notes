import type { RefObject } from 'react';
import { useEffect } from 'react';

const useOnClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: () => void,
  check?: (ev: MouseEvent, node: HTMLElement) => boolean
) => {
  useEffect(() => {
    const clickListener = (ev: MouseEvent) => {
      if (!ref.current) return;
      if (check && check(ev, ref.current)) return;
      if (ref.current.contains(ev.target as any)) return;

      handler();
    };

    document.addEventListener('mousedown', clickListener);

    return () => {
      document.removeEventListener('mousedown', clickListener);
    };
  }, [ref, handler, check]);
};

export default useOnClickOutside;
