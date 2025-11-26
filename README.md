
# Smart Home IoT Manager (KubeEdge PWA)

A Next-Generation Smart Home Management Platform designed for Edge Computing environments. Built with React (PWA), TypeScript, and KubeEdge.

## 🌟 Key Features

*   **Progressive Web App (PWA)**: Installable on iOS/Android, offline capable.
*   **Edge Native**: Designed to interface with KubeEdge MQTT brokers via WebSockets.
*   **Hybrid AI Core**:
    *   **Online**: Supports Gemini, DeepSeek, Qwen, and Doubao.
    *   **Offline**: Local Rule Engine acts as a fallback when internet is down.
    *   **Custom Persona**: Rename your AI (e.g., "Jarvis") and it remembers you.
*   **Digital Wallet**:
    *   Manage Smart Locks, Car Keys (Tesla/BYD style), and ETC cards.
    *   **Secure Payment**: Integrated "Secure Enclave" PIN pad and Dynamic QR Codes for payments.
*   **Admin Portal**: Separate dashboard for K8s/Edge node monitoring.

---

## 🚀 Installation & Deployment

### Method 1: Docker Compose (Quick Start)

The easiest way to run the full stack (App + Simulated Edge Broker) locally.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/smart-home-pwa.git
    cd smart-home-pwa
    ```

2.  **Start the stack**:
    ```bash
    docker-compose up -d --build
    ```

3.  **Access the App**:
    *   **Client App**: Open [http://localhost:8080](http://localhost:8080) in your browser.
    *   **Admin Dashboard**: Open [http://localhost:8080/admin](http://localhost:8080/admin).

### Method 2: Kubernetes / KubeEdge

Deploy to a real K8s cluster or a KubeEdge setup.

1.  **Build the Image**:
    ```bash
    docker build -t smart-home-server:latest .
    ```

2.  **Deploy using Kubectl**:
    ```bash
    kubectl apply -f k8s/deployment.yaml
    kubectl apply -f k8s/service.yaml
    ```

3.  **Deploy using Helm**:
    ```bash
    helm install smart-home ./k8s
    ```

---

## 📱 Features Guide

### 1. Smart Assistant (Voice & Text)
*   Click the **Sparkles** icon to open the chat.
*   **Voice Control**: Hold the microphone button to speak (Push-to-Talk).
*   **Model Switching**: Click the header dropdown to switch between **Gemini**, **DeepSeek**, **Qwen**, or **Doubao**.
*   **Custom Name**: Click the **Settings (Gear)** icon to rename your assistant (e.g., "Friday"). Try saying "Hello Friday" to test it.

### 2. Digital Wallet & Payments
*   Navigate to the **Wallet & Keys** tab.
*   **Bank Cards**: Click "Show Payment Code". You will be prompted to enter a 6-digit PIN (Default simulation: any 6 digits).
*   **Security**: The QR code is dynamic and refreshes every 60 seconds to prevent screenshots.

### 3. Device Scanning
*   Click the **Scan New IoT Node** button on the dashboard.
*   This opens a simulated camera HUD to scan QR codes on physical devices (simulated).

---

## 🛠️ Configuration

### Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `API_KEY` | Google Gemini API Key (Optional) | `undefined` (Fallbacks to local mode) |
| `REACT_APP_MQTT_URL` | WebSocket URL for MQTT Broker | `ws://localhost:9001` |

### Customizing the Offline Engine
Modify `services/aiService.ts` to add more local keywords and rules for the offline assistant.

---

## 📦 Architecture

*   **Frontend**: React 19, Tailwind CSS, Lucide Icons, Recharts.
*   **State**: Local React State (simulating real-time socket data).
*   **Connectivity**: WebSockets (simulated for demo, ready for MQTT integration).
*   **Build**: Vite + Multi-stage Docker Build (Node -> Nginx).

