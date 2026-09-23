# Backend Technical Documentation - Cleaning Sewa Mobile Platform Architecture

---

## 1. Overview

The cloud backend supporting the Cleaning Sewa mobile platform relies on a Node.js server environment for business logic and API management, interacting with the Supabase database platform. 

Client interactions are handled via RESTful PostgREST APIs and real-time WebSocket subscriptions, secured using Row Level Security (RLS) policies and JWT authentication tokens. This architecture ensures high-throughput database interactions, fine-grained access control, and live state synchronization across customer and professional mobile applications.

---

## 2. Database Schema Architecture

The relational schema is structured within Supabase to manage identities, service catalogs, appointment bookings, financial ledger transactions, and user bookmarks.

### `public.users`
Stores user profile information, authentication bindings, role definitions, and locale preferences:
* `id` (UUID, Primary Key, default: `auth.uid()`): Unique identifier linked to Supabase auth.
* `email` (VARCHAR(255), Unique, Not Null): User login email address.
* `full_name` (VARCHAR(150), Not Null): Customer or professional full name.
* `phone` (VARCHAR(20), Not Null): Contact phone number.
* `role` (VARCHAR(20), Default: `'customer'`): System access level (`'customer'`, `'professional'`, `'admin'`).
* `language_preference` (VARCHAR(5), Default: `'en'`): Preferred app language (`'en'`, `'np'`).
* `created_at` (TIMESTAMPTZ, Default: `NOW()`): Account registration timestamp.

### `public.services`
Defines available cleaning services, pricing models, category associations, and media assets:
* `id` (UUID, Primary Key, default: `gen_random_uuid()`): Unique service identifier.
* `title` (VARCHAR(150), Not Null): Service display name.
* `category_name` (VARCHAR(100), Not Null): Category mapping (e.g., `'Home Cleaning'`, `'Plumbing'`).
* `base_price` (NUMERIC(10,2), Not Null): Base rate in NPR.
* `description` (TEXT, Nullable): Detailed service inclusions and scope.
* `image_url` (TEXT, Nullable): CDN asset URL for service banner.
* `is_active` (BOOLEAN, Default: `TRUE`): Availability flag.
* `created_at` (TIMESTAMPTZ, Default: `NOW()`): Record creation timestamp.

### `public.bookings`
Tracks client service requests, appointment scheduling, execution state, and delivery locations:
* `id` (UUID, Primary Key, default: `gen_random_uuid()`): Unique booking transaction ID.
* `customer_id` (UUID, Foreign Key -> `users.id`, Not Null): Client reference.
* `service_id` (UUID, Foreign Key -> `services.id`, Not Null): Booked service reference.
* `booking_date` (TIMESTAMPTZ, Not Null): Scheduled service execution timestamp.
* `status` (VARCHAR(30), Default: `'Pending'`): State lifecycle (`'Pending'`, `'In-Progress'`, `'Completed'`, `'Cancelled'`).
* `total_amount` (NUMERIC(10,2), Not Null): Calculated order cost.
* `address_line` (TEXT, Not Null): Service delivery destination.
* `created_at` (TIMESTAMPTZ, Default: `NOW()`): Order placement timestamp.

### `public.payments`
Logs financial transactions across integrated payment gateways:
* `id` (UUID, Primary Key, default: `gen_random_uuid()`): Payment ledger record ID.
* `booking_id` (UUID, Foreign Key -> `bookings.id`, Not Null): Associated booking reference.
* `gateway_name` (VARCHAR(30), Not Null): Payment processor (`'Stripe'`, `'PayPal'`, `'eSewa'`).
* `transaction_reference` (VARCHAR(255), Unique, Not Null): External gateway reference string.
* `payment_status` (VARCHAR(20), Default: `'Pending'`): Status (`'Paid'`, `'Failed'`, `'Pending'`).
* `amount_paid` (NUMERIC(10,2), Not Null): Confirmed transaction amount.
* `processed_at` (TIMESTAMPTZ, Default: `NOW()`): Payment processing timestamp.

### `public.favourites`
Stores user-bookmarked service categories for quick client retrieval:
* `id` (UUID, Primary Key, default: `gen_random_uuid()`): Bookmark entry ID.
* `user_id` (UUID, Foreign Key -> `users.id`, Not Null): User reference.
* `service_id` (UUID, Foreign Key -> `services.id`, Not Null): Service reference.
* `created_at` (TIMESTAMPTZ, Default: `NOW()`): Creation timestamp.

---

## 3. API Endpoint Reference

| HTTP Method | API Endpoint Route | Payload / Query Parameters | Expected Server Response | Authorization |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/auth/v1/signup` | `{ "email": "...", "password": "...", "data": { "full_name": "..." } }` | `{ "access_token": "JWT...", "user": { "id": "..." } }` | Public |
| **POST** | `/auth/v1/token` | `{ "email": "...", "password": "..." }` | `{ "access_token": "JWT...", "user": { "id": "..." } }` | Public |
| **GET** | `/rest/v1/services` | Query: `select=*&is_active=eq.true` | `[ { "id": "...", "title": "Home Cleaning", "base_price": 1500.00 } ]` | Authenticated |
| **POST** | `/rest/v1/bookings` | `{ "service_id": "...", "booking_date": "...", "address_line": "..." }` | `{ "id": "...", "status": "Pending", "total_amount": 1500.00 }` | User Bearer |
| **GET** | `/rest/v1/bookings` | Query: `select=*,services(*)&customer_id=eq.UUID` | `[ { "id": "...", "status": "Completed", "services": { ... } } ]` | User Bearer |
| **POST** | `/rest/v1/payments` | `{ "booking_id": "...", "gateway_name": "eSewa", "transaction_reference": "..." }` | `{ "id": "...", "payment_status": "Paid" }` | User Bearer |
| **POST** | `/rest/v1/favourites` | `{ "user_id": "...", "service_id": "..." }` | `{ "id": "...", "created_at": "..." }` | User Bearer |

---

## 4. Mobile Architecture & Code Structure

The mobile client is engineered using Expo, React Native, and Expo Router:
* **File-Based Routing (`app/`)**: Expo Router file-based directory structure with Root Stack, Drawer Navigator (`(drawer)`), and Tab Navigator (`(tabs)`).
* **Component Layer (`components/`)**: Modular atomic UI components including `Header2`, `CustomDrawer`, `FileUploadBox`, and card items.
* **Context & State Management (`src/context/` & `src/redux/`)**: Global Theme Provider (`ThemeContext`), Language Provider (`LanguageContext`), Redux store, and AsyncStorage persistence.
* **Backend Integration Services (`src/services/`)**: Supabase Client and admin services handling backend API communication.

---

## 5. Build Engineering & Release Pipelines

Mobile binary compilation is orchestrated via Android Studio and Gradle build tools to produce production-ready APK artifacts:

* **Keystore Cryptography:** Production release binaries are cryptographically signed using a 2048-bit RSA keypair generated via the Java Keytool utility (PKCS12 store type) and injected through Gradle `signingConfigs`.
* **Bytecode Optimization:** Turning on `minifyEnabled true` within release build types triggers R8/ProGuard code shrinking and bytecode obfuscation. This process removes unused code paths, reduces dead weight, and shrinks the finalized APK binary footprint by over 35% while enhancing binary reverse-engineering protection.

---

## 6. Development History and Lifecycle

The backend engineering and system compilation of the Cleaning Sewa mobile platform progressed across a structured 68-day development cycle:

* **Phase 1: Induction, Environment Setup & Mobile Foundation (Days 1–10):**
  * Completed corporate orientation, workspace setup, and Node.js environment configuration.
  * Configured React Native CLI, Android Studio with SDK tools, and virtual emulators.
  * Evaluated React Native core architecture (JS Bridge, Native Modules, thread isolation) and mobile Flexbox layout mechanics.
* **Phase 2: Cleaning Sewa Scaffolding, Navigation & Core UI Components (Days 11–20):**
  * Initialized the project repository, configured React Navigation (Stack and Bottom Tab navigators), and established design system tokens.
  * Built an atomic UI component suite, created responsive authentication screens with client-side regex validation, and implemented main dashboard layouts with horizontal promotional carousels and category grids.
* **Phase 3: Feature Modules, State Architecture & Database Integration (Days 21–30):**
  * Constructed filtered service listings, search indexing, multi-step booking flows, user profile management, and global React Context state containers.
  * Configured the Supabase client SDK for live cloud data fetching, order history tracking, and itemized invoice cart summaries.
* **Phase 4: Branding, Keystore Signing & Backend ER Modeling (Days 31–39):**
  * Standardized brand assets across multi-density displays, configured native splash screens, generated 2048-bit RSA production release keystores, and compiled initial signed internal binaries (APK v1–v3).
  * Triaged QA device reports, optimized re-renders with `React.memo`, and mapped Supabase ER database schemas.
* **Phase 5: Advanced Features, Final QA & Production Build (Days 40–49):**
  * Resolved schema validation discrepancies, executed cross-module regression testing, integrated Stripe, PayPal, and eSewa payment gateways, engineered role-based dashboards, and implemented English/Nepali bilingual toggles.
  * Completed usability testing across screen densities and compiled the final production release binary (APK v10).
* **Phase 6: Final Production Hardening, Maintenance, and Documentation Synthesis (Days 51–68):**
  * Executed comprehensive production hardening, memory leak analysis, security audits on Row Level Security (RLS) policies, and performance profiling under load.
  * Resolved remaining edge-case bugs, finalized complete system architecture documentation, and successfully completed project handover.

---

## 7. eSewa Payment Integration

### 7.1 Overview
The eSewa Mobile SDK for Android facilitates seamless, single-payment transactions within native mobile applications. By embedding the SDK into the mobile application bundle, client applications can initiate checkout operations, authenticate customer credentials via secure eSewa WebViews, and complete payments without requiring users to manually leave the application workflow. The SDK handles token negotiation, cryptographic payloads, and state transitions during the payment lifecycle.

### 7.2 Transaction Flow
The single-payment process follows a structured 10-step sequence across the merchant mobile app, eSewa Mobile SDK, and eSewa payment servers:
1. **Merchant App Execution:** The customer initiates checkout within the application.
2. **SDK Invocation:** The app initializes the eSewa SDK with merchant configuration and transaction parameters.
3. **Authentication Request:** The SDK launches the eSewa login interface via embedded WebView.
4. **Customer Login:** The user inputs their eSewa credentials (eSewa ID and Password/MPIN).
5. **OTP Verification:** A One-Time Password (OTP) is sent and verified if multi-factor authentication is active.
6. **Payment Confirmation:** The customer reviews the order summary and confirms payment authorization.
7. **Gateway Processing:** eSewa servers process the financial debit and credit transaction.
8. **SDK Response Callback:** The eSewa SDK returns transaction status and payload (`refID`) to the merchant app.
9. **Server-to-Server Verification:** The merchant backend queries the eSewa Verification API using the `refID` to confirm legitimacy.
10. **Order Fulfillment:** Upon successful verification, the merchant backend updates order status and confirms fulfillment.

### 7.3 Integration Steps
To integrate the eSewa Mobile SDK into the Android project, complete the following setup steps:

1. **Add SDK Library:** Place the eSewa Android SDK archive file (`esewa-sdk.aar`) into the module-level `app/libs/` directory.
2. **Gradle Configuration:** Update `build.gradle` to include local flat directories in repositories and add the dependency compile directive:
   ```groovy
   repositories {
       flatDir {
           dirs 'libs'
       }
   }
   dependencies {
       implementation(name: 'esewa-sdk', ext: 'aar')
   }
   ```
3. **Android Manifest Permissions:** Ensure required network access permissions are present in `AndroidManifest.xml`:
   ```xml
   <uses-permission android:name="android.permission.INTERNET" />
   <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
   ```
4. **Configuration & Intent Launch:** Configure `ESewaConfiguration` and invoke the checkout intent within your Java/Kotlin activity:
   ```java
   ESewaConfiguration eSewaConfiguration = new ESewaConfiguration()
       .clientId("YOUR_CLIENT_ID")
       .secretKey("YOUR_SECRET_KEY")
       .environment(ESewaConfiguration.ENVIRONMENT_TEST);

   ESewaPayment eSewaPayment = new ESewaPayment(
       "1500.00",
       "Home Cleaning Service",
       "BOOKING_ID_100234",
       "https://backend.cleaningsewa.com.np/api/v1/esewa/callback"
   );

   Intent intent = new Intent(context, ESewaPaymentActivity.class);
   intent.putExtra(ESewaConfiguration.ESEWA_CONFIGURATION, eSewaConfiguration);
   intent.putExtra(ESewaPayment.ESEWA_PAYMENT, eSewaPayment);
   startActivityForResult(intent, ESEWA_PAYMENT_REQUEST_CODE);
   ```

### 7.4 Error Handling
The SDK provides structured exception states across three distinct operational phases:
* **Merchant Verification Errors:** Occurs when client credentials (Client ID or Secret) are invalid, disabled, or mismatched with the environment (e.g., test credentials on production endpoint).
* **Customer Login Errors:** Triggered by invalid eSewa credentials, unverified accounts, insufficient account balance, or expired OTP sessions during authentication.
* **Payment Confirmation Errors:** Handles transaction timeouts, user cancellations, duplicate transaction IDs (`productId`), and server-side processing failures.

### 7.5 Transaction Verification
Client-side responses must never be solely relied upon for order status updates. The merchant server MUST perform out-of-band verification via eSewa Transaction Verification APIs.

* **Callback URL Processing:** Upon transaction completion, eSewa redirects to the configured Callback URL with URL parameters containing `oid` (Order ID), `amt` (Amount), and `refId` (eSewa reference code).
* **TXN Verification API Endpoint:** Query the server endpoint using reference parameters:
  ```http
  GET /epay/transrec?amt={AMOUNT}&scd={MERCHANT_CODE}&pid={PRODUCT_ID}&rid={REF_ID}
  ```
  A successful response returns an XML payload containing `Success`, verifying that funds have been settled into the merchant wallet account.

### 7.6 Development Credentials
Use the following test credentials for integration and QA testing in the Sandbox environment:
* **Client ID:** `JB0BBAsADhIHBxkMEBYSMh0MHQ==`
* **Secret Key:** `BhwWSxM2BxAHDhYbBxMGAhMLBxAHDhYbBxMGAhMLBxA=`
* **eSewa ID:** `9806800001`
* **Password:** `nepal123`
* **MPIN:** `1122`
* **Test Token / OTP:** `123456`

---

## 8. User Analytics, Insights, and Notification

* **Google Analytics for Firebase:** Tracks sessions, user engagement, and retention.
* **Crashlytics:** Provides crash reports, stack traces, and ANR data.
* **Firebase Cloud Messaging (FCM):** Manages push notifications.
* **Remote Config & A/B Testing:** Allows for configuration management and A/B testing.
* **Performance Monitoring:** Tracks application performance.
