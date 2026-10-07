class GoogleApiClient {
  /**
   * Initialize the Google API Client
   * @param {Object} config
   * @param {string} [config.apiKey] - Google API Key (optional)
   * @param {string} [config.accessToken] - OAuth2 Access Token (optional)
   * @param {string} [config.baseUrl] - Base URL for Google REST APIs
   */
  constructor({ apiKey = null, accessToken = null, baseUrl = 'https://www.googleapis.com' } = {}) {
    this.apiKey = apiKey;
    this.accessToken = accessToken;
    this.baseUrl = baseUrl;
  }

  setAccessToken(token) {
    this.accessToken = token;
  }

  setApiKey(key) {
    this.apiKey = key;
  }

  /**
   * General request method for Google endpoints
   */
  async request(endpoint, { method = 'GET', body = null, queryParams = {}, headers = {} } = {}) {
    // URL mit Parametern aufbauen
    const url = new URL(endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`);

    if (this.apiKey) {
      queryParams.key = this.apiKey;
    }

    Object.entries(queryParams).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        url.searchParams.append(key, val);
      }
    });

    // Request Headers konfigurieren
    const requestHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...headers,
    };

    if (this.accessToken) {
      requestHeaders['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const config = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== 'GET') {
      config.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    try {
      const response = await fetch(url.toString(), config);

      // Detaillierte Fehlerbehandlung bei Google-spezifischen Statuscodes
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(`Google API Client Error: ${message}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[GoogleApiClient] Request failed:', error.message);
      throw error;
    }
  }

  // Convenience-Methoden
  get(endpoint, queryParams = {}) {
    return this.request(endpoint, { method: 'GET', queryParams });
  }

  post(endpoint, body = {}, queryParams = {}) {
    return this.request(endpoint, { method: 'POST', body, queryParams });
  }

  put(endpoint, body = {}, queryParams = {}) {
    return this.request(endpoint, { method: 'PUT', body, queryParams });
  }

  delete(endpoint, queryParams = {}) {
    return this.request(endpoint, { method: 'DELETE', queryParams });
  }
}