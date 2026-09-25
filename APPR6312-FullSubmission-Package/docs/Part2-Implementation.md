# Part 2 — Disaster Alleviation Foundation Implementation
**Module: APPR6312**  
**Students:** JONES MATJENTJE SEPURU ST10439177, Khumela Sendelani ST10436040  
**GitHub:** https://github.com/Jonessepuru/giftofthegivers.git

> Academic-integrity note: Per IIE guidelines, AI only for outlines/grammar. No AI images/diagrams/tables. Material below is skeleton + actual code from your solution.

## Section A: Azure Functions (30)

### A.1 Add Function Project (10)
- Solution: Web + Functions + Helpers
- Program.cs: FunctionsApplication.CreateBuilder + OpenTelemetry
- TaxCertificateFunction: POST /api/GenerateTaxCertificate -> uses Helpers to generate PDF
- LogUpdateFunction: POST /api/LogProjectUpdate -> logs LOG-YYYYMMDDHHmmss
- host.json v2.0, local.settings.json UseDevelopmentStorage=true, launchSettings port 7044

[Screenshot: Solution Explorer]
[Screenshot: Function code]

### A.2 Run and Test Locally (10)
- dotnet run Functions (7044) + Web (5118)
- Postman: GenerateTaxCertificate with {donationId, donorName, amount, currency, isRecurring, recurringMonths} -> 200 pdf
- Postman: LogProjectUpdate with {projectName, title, postedBy} -> 200 {status:logged, logReference}
- Invalid: amount <=0 -> 400, missing title -> 400

[Screenshot: terminal]
[Screenshot: Postman PDF]
[Screenshot: Postman JSON]

### A.3 Deploy to Azure (10)
- VS Publish wizard to Function App Linux .NET 8 isolated
- CLI: scripts/deploy-azure.sh creates storage + func app southafricanorth, dotnet publish + zip deploy
- Live URL: https://gotg-func-xxxxx.azurewebsites.net/api/GenerateTaxCertificate

[Screenshot: Publish success]
[Screenshot: Portal Function App]

## Section B: Azure Repos Git (25)

### B.1 Connect to Azure Repos (10)
- Create DevOps repo giftofthegivers, push solution
- Includes Web, Functions, Helpers, wwwroot/lib (Bootstrap 5.1.0, jQuery 3.6.0), tests, scripts

[Screenshot: Repos file list]
[Screenshot: git log --oneline --graph]

### B.2 Branching & Merging (15)
- main, donations-feature (Jones), volunteer-feature (Khumela)
- Commits: feat: add donation total calc, feat: add volunteer registration
- PR merge to main via Azure DevOps

[Screenshot: Branches]
[Screenshot: Commits per branch]
[Screenshot: PR merge]

## Section C: Pipelines (25)

### C.1 Create Build Pipeline (15)
- azure-pipelines.yml: trigger main, ubuntu-latest, UseDotNet .NET 8, Restore, Build, Test, Publish Web+Functions, Publish Artifacts

[Screenshot: YAML]
[Screenshot: Pipeline definition]

### C.2 Trigger Build from Commit (10)
- git commit -m "fix: donation validation" && git push -> auto trigger
- Green build + tests

[Screenshot: Pipeline run triggered]
[Screenshot: Logs green]

## Section D: Artifacts (20)

### D.1 Create Helper Library (10)
- GiftOfTheGivers.Helpers: DonationCalculator (CalculateTotal, FormatCurrency R/ $/ € N2, IsValidAmount), TaxCertificate (FormatCertificateNumber GOTG-YYYY-D6, GeneratePdf QuestPDF), TaxCertificateData
- dotnet pack -> GiftOfTheGivers.Helpers.1.0.0.nupkg
- publish-nuget.sh -> dotnet nuget push to GOTG-Feed
- nuget.config feed entry

[Screenshot: Helpers project]
[Screenshot: Feed with package]

### D.2 Use Package in Web App (10)
- Switch ProjectReference to PackageReference Version 1.0.0
- Usage in DonationsController: FormatCertificateNumber, FormatCurrency(CalculateTotal), GeneratePdf -> File(pdf)

[Screenshot: PackageReference]
[Screenshot: Confirmation page]
[Screenshot: Build success]

## Submission Checklist Part 2
- Screenshots: solution, local run, Postman, live URLs, Repos commits/branches/PRs, Pipeline YAML+green, Artifacts feed, PackageReference + confirmation page
- Code snippets as above (your actual files)
- Reflection per member
- References Harvard

## References
- Gift of the Givers Foundation. 2025. Available at https://giftofthegivers.org/
- Microsoft Azure Functions isolated guide, Repos branching, Pipelines YAML, Artifacts NuGet, QuestPDF
