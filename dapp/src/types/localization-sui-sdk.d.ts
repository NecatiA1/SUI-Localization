declare module "localization-sui-sdk" {
  export interface LocalizationClientConfig {
    apiId: string;
    apiKey: string;
    baseUrl?: string;
  }

  export interface StartParams {
    userAddress: string;
    cityName: string;
    countryCode: string;
    meta?: any;
  }

  export interface StartWithLocationParams {
    userAddress: string;
    meta?: any;
  }

  export interface StartResponse {
    geoTxId: number;
    createdAt: string;
    city: {
      id: number;
      name: string;
      countryCode: string;
    };
  }

  export interface ConfirmParams {
    geoTxId: number;
    txDigest: string;
  }

  export interface ConfirmResponse {
    geoTxId: number;
    status: string;
    txScore: string;
    confirmedAt: string;
  }

  export interface LocalizationClient {
    start(params: StartParams): Promise<StartResponse>;
    startWithLocation(
      params: StartWithLocationParams
    ): Promise<StartResponse>;
    confirm(params: ConfirmParams): Promise<ConfirmResponse>;
  }

  export function createLocalizationClient(
    config: LocalizationClientConfig
  ): LocalizationClient;
}
