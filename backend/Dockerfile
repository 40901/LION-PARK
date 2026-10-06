# =============================================================================
# Lion Park — API (.NET 10)
# Build multi-estágio: o SDK (~800 MB) fica só no estágio de compilação;
# a imagem final carrega apenas o runtime ASP.NET (~220 MB).
# Contexto de build esperado: ./backend
# =============================================================================

# ----------------------------------------------------------------------------
# Estágio 1 — restauração e compilação
# ----------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS build
WORKDIR /src

# Copia primeiro apenas os .csproj: enquanto as dependências não mudarem,
# o Docker reaproveita a camada de restore e pula o download dos pacotes.
COPY LionPark.Domain/LionPark.Domain.csproj                 LionPark.Domain/
COPY LionPark.Application/LionPark.Application.csproj       LionPark.Application/
COPY LionPark.Infrastructure/LionPark.Infrastructure.csproj LionPark.Infrastructure/
COPY LionPark.Api/LionPark.Api.csproj                       LionPark.Api/
RUN dotnet restore LionPark.Api/LionPark.Api.csproj

# Agora o código-fonte, que muda a cada commit
COPY . .
RUN dotnet publish LionPark.Api/LionPark.Api.csproj \
      -c Release \
      -o /app/publish \
      --no-restore \
      /p:UseAppHost=false

# ----------------------------------------------------------------------------
# Estágio 2 — runtime
# ----------------------------------------------------------------------------
FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS runtime
WORKDIR /app

# Executa como usuário sem privilégios: se a aplicação for comprometida,
# o atacante não recebe root dentro do contêiner.
RUN addgroup -S lionpark && adduser -S lionpark -G lionpark

COPY --from=build --chown=lionpark:lionpark /app/publish .

ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Production \
    DOTNET_RUNNING_IN_CONTAINER=true \
    DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false

# Cultura pt-BR precisa do ICU — a imagem alpine não o traz por padrão
RUN apk add --no-cache icu-libs tzdata curl
ENV TZ=America/Sao_Paulo

USER lionpark
EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --start-period=20s --retries=5 \
  CMD curl -fsS http://127.0.0.1:8080/api/Spot >/dev/null || exit 1

ENTRYPOINT ["dotnet", "LionPark.Api.dll"]
