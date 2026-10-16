FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY ./EnterpriseSchema/bin/release/net10.0/publish/ .

EXPOSE 8080
ENV ASPNETCORE_URLS http://+:8080

ENTRYPOINT ["dotnet", "EnterpriseSchema.dll"]