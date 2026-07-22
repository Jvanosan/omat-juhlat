export type ConfirmationApiResponse = {
  success?: boolean;
  error?: string;
  alreadyConfirmed?: boolean;
};

export type ConfirmationStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";