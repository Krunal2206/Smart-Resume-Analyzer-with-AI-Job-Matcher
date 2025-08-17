// Environment variable validation
export function validateEnv() {
  const requiredEnvVars = [
    "MONGODB_URI",
    "NEXTAUTH_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "OPENAI_API_KEY",
    "RAPIDAPI_KEY",
    "RAPIDAPI_HOST",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.error("Missing required environment variables:", missingVars);
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  // Optional but recommended
  const optionalVars = ["REDIS_URL", "CONTACT_EMAIL", "CONTACT_EMAIL_PASSWORD"];
  const missingOptional = optionalVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingOptional.length > 0) {
    console.warn("Missing optional environment variables:", missingOptional);
  }
}

// Call validation on module load
validateEnv();
