class ServiceError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ServiceError";
  }
}

class HttpService {
  private static async handleFetchRequest<T>(
    url: string,
    method: string,
    body?: unknown
  ): Promise<T> {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      // API isteği başarısız olduğunda ServiceError fırlat
      if (!response.ok) {
        throw new ServiceError(
          response.status,
          `API call failed with status: ${response.status}`
        );
      }

      // JSON'a parse etmeye çalış
      const data = await response.json();

      // Eğer veri içinde success flag varsa ve success false değilse, hata fırlat
      if (data.success === false) {
        throw new ServiceError(
          500,
          `API call failed with message: ${data.message || "Unknown error"}`
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }

      console.error(`Request to ${url} failed: `, error);
      throw new ServiceError(500, "Internal Server Error");
    }
  }

  static async get<T>(url: string): Promise<T> {
    return this.handleFetchRequest<T>(url, "GET");
  }

  static async post<T>(url: string, body: unknown): Promise<T> {
    return this.handleFetchRequest<T>(url, "POST", body);
  }

  static async put<T>(url: string, body: unknown): Promise<T> {
    return this.handleFetchRequest<T>(url, "PUT", body);
  }

  static async delete<T>(url: string): Promise<T> {
    return this.handleFetchRequest<T>(url, "DELETE");
  }
}

export { HttpService, ServiceError };
