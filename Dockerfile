# Use a pre-built image with Android SDK, Gradle, and Java 17
FROM mobiledevops/android-sdk-image:34.0.0-jdk17

# Set the working directory inside the container
WORKDIR /app

# Copy the Gradle distribution into the container
COPY gradle-8.11.1-all.zip .

# Copy the entire project into the container
COPY . .

# Switch to root to change permissions
USER root

# Grant execution permissions to the Gradle wrapper
RUN chmod +x /app/android/gradlew

# Switch back to the default non-root user
USER mobiledevops


