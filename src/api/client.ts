import { config } from '@config/env';
import { ApiError } from './errors';
import { apiLogger } from './logger';

const DEFAULT_TIMEOUT_MS = 10_000;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!config.apiBaseUrl) {
    throw new ApiError(0, 'API base URL이 설정되지 않았습니다.');
  }

  const method = options?.method ?? 'GET';
  const startTime = Date.now();

  apiLogger.request(method, path);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  if (options?.signal) {
    options.signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const url = `${config.apiBaseUrl}${path}`;
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      const error = new ApiError(res.status, `API 요청 실패: ${res.status}`, body);
      apiLogger.error(method, path, error);
      throw error;
    }

    const elapsed = Date.now() - startTime;

    if (res.status === 204 || res.headers.get('content-length') === '0') {
      apiLogger.response(method, path, res.status, elapsed);
      return null as T;
    }

    const data = await res.json() as T;
    apiLogger.response(method, path, res.status, elapsed);
    return data;
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') {
      const error = new ApiError(0, 'API 요청 시간 초과', null);
      apiLogger.error(method, path, error);
      throw error;
    }
    if (!(e instanceof ApiError)) {
      apiLogger.error(method, path, e);
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

export const apiClient = {
  get<T>(path: string): Promise<T> {
    return request<T>(path);
  },
  post<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};
