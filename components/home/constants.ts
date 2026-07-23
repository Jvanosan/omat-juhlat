import {
  SERVICE_OPTIONS,
} from "@/lib/services";

export const HOME_SERVICES =
  SERVICE_OPTIONS.map(
    ({
      id,
      label,
      icon,
    }) => ({
      id,
      label,
      icon,
    }),
  );