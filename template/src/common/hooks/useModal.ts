import { useCallback, useState } from "react";

type Modal = [boolean, () => void, () => void];

export function useModal(): Modal {
  const [open, setOpen] = useState(false);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const onClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return [open, onOpen, onClose];
}
