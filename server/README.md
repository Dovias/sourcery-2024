# Apartment booking application

## Tools
* IDE https://www.jetbrains.com/idea/
* Docker https://www.docker.com/products/docker-desktop/
* Git https://git-scm.com/downloads
* Postman https://www.postman.com/

#### Java 21

- Java 21 JDK download: [https://adoptium.net/](https://adoptium.net/)
- Environment variables needed
    - “JAVA_HOME” - https://confluence.atlassian.com/doc/setting-the-java_home-variable-in-windows-8895.html
    - "Path" – add path to your JDK bin file (e.g. C:\Program Files\Eclipse Adoptium\jdk-21.0.2-hotspot\bin)

# Database

```bash
# launch and init empty db
docker-compose up -d
```

```bash
# recreate db / cleanup
docker-compose down -v && docker-compose up -d
```

## Starting service

Run directly via IDEA (Shift + F10) or

```bash
./gradlew run
```
