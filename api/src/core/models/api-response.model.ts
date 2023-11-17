export class ApiResponseModel<T> {
  data: T;
  message?: string;
  success?: boolean;
}
