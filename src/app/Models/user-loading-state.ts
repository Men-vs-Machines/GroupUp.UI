export interface UserLoadingState<T> {
  isLoading: boolean;
  value?: T;
  needsSignIn?: boolean;
}
