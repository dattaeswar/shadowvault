# Shadow Vault

**Shadow Vault** is a secure, cloud-based notes application built with **React Native (Expo)** and **Supabase**. It features a Cyberpunk/Hacker aesthetic with Neon Green accents and a "terminal" style interface.

## Features

-   **Secure Storage**: Secrets are stored in a Supabase PostgreSQL database.
-   **Cyberpunk UI**: Dark mode interface with glowing neon effects.
-   **Real-time Sync**: Secrets are fetched and updated in real-time (conceptually).
-   **Cross-Platform**: Runs on Android, iOS, and Web.
-   **Live Demo**: [Shadow Vault Web](https://shadow-vault-two.vercel.app)

## Tech Stack

-   **Frontend**: React Native, Expo, TypeScript
-   **Backend**: Supabase (PostgreSQL)
-   **Styling**: `StyleSheet` & `expo-linear-gradient`
-   **Icons**: `lucide-react-native`

## Setup & Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/dattaeswar/shadowvault.git
    cd shadowvault
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Supabase Setup**:
    -   Create a new Supabase project.
    -   Run the SQL script provided in `supabase_setup.sql` in your Supabase SQL Editor.
    -   Update `app/(tabs)/index.tsx` with your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

4.  **Run the App**:
    ```bash
    npx expo start
    ```

## License

MIT
