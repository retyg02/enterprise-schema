FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["EnterpriseSchema/EnterpriseSchema.csproj", "EnterpriseSchema/"]
RUN dotnet restore "EnterpriseSchema/EnterpriseSchema.csproj"

COPY . .
WORKDIR "/src/EnterpriseSchema"
RUN dotnet publish "EnterpriseSchema.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080
ENV ASPNETCORE_URLS http://+:8080

ENTRYPOINT ["dotnet", "EnterpriseSchema.dll"]