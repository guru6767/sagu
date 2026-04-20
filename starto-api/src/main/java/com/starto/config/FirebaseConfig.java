package com.starto.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;

/**
 * Fix #6: Firebase initialisation now prefers the FIREBASE_SERVICE_ACCOUNT_B64 env var
 * (base64-encoded JSON) over a file path, making it container/Antigravity-safe.
 *
 * How to generate the env var value:
 *   base64 -w 0 firebase-service-account.json   # Linux/Mac
 *   [Convert]::ToBase64String([IO.File]::ReadAllBytes("firebase-service-account.json"))  # PowerShell
 *
 * Set FIREBASE_SERVICE_ACCOUNT_B64 in Antigravity / GitHub Actions secrets.
 * For local dev, leave it unset and keep the file at the path in firebase.config-path.
 */
@Configuration
public class FirebaseConfig {

    @Value("${firebase.service-account-b64:}")
    private String serviceAccountB64;

    @Value("${firebase.config-path:src/main/resources/firebase-service-account.json}")
    private String configPath;

    @PostConstruct
    public void init() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return;
        }

        InputStream serviceAccount;

        if (StringUtils.hasText(serviceAccountB64)) {
            // Container / production path: decode inline base64 JSON
            byte[] decoded = Base64.getDecoder().decode(serviceAccountB64.trim());
            serviceAccount = new ByteArrayInputStream(decoded);
        } else {
            // Local dev fallback: load from file path
            serviceAccount = new FileInputStream(configPath);
        }

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        FirebaseApp.initializeApp(options);
        System.out.println("Firebase initialised: " + FirebaseApp.getApps().size() + " app(s)");
    }
}
