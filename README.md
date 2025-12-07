# Sui Localization — Spatial Data Layer for Sui

Sui Localization provides a geo-aware data and verification layer for the Sui ecosystem, enabling real-world location validation, geographic analytics, 3D visualization, and practical on-chain use cases.

On-chain meets real-world.  
Transactions become visible not only on the blockchain, but also on the map.

---

## Features

- **Proof of Location**  
  Location verification and historical geographic lineage for every Sui transaction.

- **Real-World Data Layer**  
  Maps, city/country analytics, behavioral insights, and regional data modeling.

- **Security & Compliance**  
  Protection against wallet theft, bot activity, and fraud through geo-behavior validation.

- **Geo-Interactive dApps**  
  Suitable for GameFi, marketing campaigns, logistics, IoT integrations, and real-world event-based applications.

- **Real-Time Visualization**  
  3D globe, city-based visualizations, and interactive spatial interfaces.

---

## Use Cases

| Sector | What It Provides |
|--------|------------------|
| Smart Marketing | Regional targeting, campaign optimization, city-level user analytics |
| Location-Driven GameFi | Location quests, territory control, movement-based game logic |
| Verified Logistics & Supply Chain | Location validation at each transfer step, immutable geo-logs, IoT + blockchain |
| Data & Analytics | Geographic distribution, heatmaps, segmentation, compliance reporting |

---

## Installation & Client Setup

Install the SDK:

```bash
npm install localization-sui-sdk
```
```bash
import { createLocalizationClient } from "localization-sui-sdk";

export const localizationClient = createLocalizationClient({
  apiId: process.env.NEXT_PUBLIC_LOCALIZATION_API_ID!,
  apiKey: process.env.NEXT_PUBLIC_LOCALIZATION_API_KEY!,
  baseUrl: process.env.NEXT_PUBLIC_LOCALIZATION_API_URL!,
});
```
Confirming an On-Chain Transaction
After the user signs and executes a Sui transaction, send the resulting txDigest value to your backend.
The SDK retrieves on-chain transaction details, calculates the SUI amount, and updates city + user analytics.



Aşağıdaki kutunun içindeki her şeyi kopyalayıp dosyanıza (örneğin README.md dosyanıza) yapıştırabilirsiniz.
Tüm kod blokları (bash, ts, ini) doğru yerlerde açılıp kapatılmıştır.
code
Markdown
# Sui Localization — Spatial Data Layer for Sui

Sui Localization provides a geo-aware data and verification layer for the Sui ecosystem, enabling real-world location validation, geographic analytics, 3D visualization, and practical on-chain use cases.

On-chain meets real-world.  
Transactions become visible not only on the blockchain, but also on the map.

---

## Features

- **Proof of Location**  
  Location verification and historical geographic lineage for every Sui transaction.

- **Real-World Data Layer**  
  Maps, city/country analytics, behavioral insights, and regional data modeling.

- **Security & Compliance**  
  Protection against wallet theft, bot activity, and fraud through geo-behavior validation.

- **Geo-Interactive dApps**  
  Suitable for GameFi, marketing campaigns, logistics, IoT integrations, and real-world event-based applications.

- **Real-Time Visualization**  
  3D globe, city-based visualizations, and interactive spatial interfaces.

---

## Use Cases

| Sector | What It Provides |
|--------|------------------|
| Smart Marketing | Regional targeting, campaign optimization, city-level user analytics |
| Location-Driven GameFi | Location quests, territory control, movement-based game logic |
| Verified Logistics & Supply Chain | Location validation at each transfer step, immutable geo-logs, IoT + blockchain |
| Data & Analytics | Geographic distribution, heatmaps, segmentation, compliance reporting |

---

## Installation & Client Setup

Install the SDK:

```bash
npm install localization-sui-sdk
Initialize the client:
code
Ts
import { createLocalizationClient } from "localization-sui-sdk";

export const localizationClient = createLocalizationClient({
  apiId: process.env.NEXT_PUBLIC_LOCALIZATION_API_ID!,
  apiKey: process.env.NEXT_PUBLIC_LOCALIZATION_API_KEY!,
  baseUrl: process.env.NEXT_PUBLIC_LOCALIZATION_API_URL!,
});
```

Confirming an On-Chain Transaction
After the user signs and executes a Sui transaction, send the resulting txDigest value to your backend.
The SDK retrieves on-chain transaction details, calculates the SUI amount, and updates city + user analytics.
code

```bash
// Execute your Sui transaction
const result = await suiWallet.signAndExecuteTransaction({ transaction });

// Confirm with Localization SDK
const confirmRes = await localizationClient.confirm({
  geoTxId: startRes.geoTxId,   // received from startWithLocation()
  txDigest: result.digest,     // Sui transaction hash
});

// Response includes:
// - status ("CONFIRMED")
// - amountSui
// - txScore
// - confirmedAt
```

Generate API Access
To use the Localization SDK, you must first generate an API ID and API Key.
These credentials allow your backend and dApp to securely communicate with the Localization service.
1. Create a New API Credential
Go to the Generate API Access page in the dashboard and fill in:
Field	Description
App Name	Name of your application (e.g., SuiSwap, MyApp)
Web Domain	Domain where your application is running
Description	Short description of how you will use the API
Select Create New to generate your credentials.
2. API Credentials Generated
Once created, the system will provide:
APP ID — Unique identifier for your application
API KEY — Secret key used for backend authentication
Keep these values private.
3. Add Environment Variables
Add the generated values to your .env file:

```bash
NEXT_PUBLIC_LOCALIZATION_API_ID=your_app_id
NEXT_PUBLIC_LOCALIZATION_API_KEY=your_api_key
NEXT_PUBLIC_LOCALIZATION_API_URL=https://api.sui-localization.xyz
```

The SDK will automatically read these variables.

```bash
export const localizationClient = createLocalizationClient({
  apiId: process.env.NEXT_PUBLIC_LOCALIZATION_API_ID!,
  apiKey: process.env.NEXT_PUBLIC_LOCALIZATION_API_KEY!,
  baseUrl: process.env.NEXT_PUBLIC_LOCALIZATION_API_URL!,
});
```
