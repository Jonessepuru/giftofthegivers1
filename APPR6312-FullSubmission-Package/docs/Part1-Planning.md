# Part 1 — Project Planning: Working Outlines & Starting Points

> **Academic-integrity note:** Per the IIE guidelines quoted in the brief, AI may only assist
> with *initial ideas / structural outlines* and grammar for written sections, and **may not**
> generate images, diagrams, charts, ERDs or tables. The material below is therefore provided
> **only as skeleton outlines and prompts for your own writing**. Your group must write the full
> prose in your own words and **draw the ERD yourselves**.

---

## Section A — Agile Project Planning with Azure Boards (30)

### 1.1 Azure Boards setup (10) — points to cover in your write-up
- Create an Azure DevOps organisation + project (name: *Gift of the Givers*).
- **Team members & roles** (fill in your real names):
  - Project Lead — backlog ownership, sprint planning.
  - Database Designer — schema, ERD, Azure SQL.
  - Developer(s) — ASP.NET Core web app + Azure Functions.
  - Quality Reviewer — testing, pipeline, code review.
- **Iteration paths (sprints):** Sprint 0 (setup), Sprint 1 (prototype), Sprint 2, Sprint 3.
- **Area paths (modules):** Authentication, Donations, Volunteers, Relief Projects, Reporting.
- Explanation angle: how iterations + area paths mirror real agile collaboration (shared visibility,
  vertical slices per module, WIP limits, daily stand-up around the board).
- *Insert screenshots of: project overview, Team configuration, Iterations, Area paths.*

### 1.2 Epics / User Stories / Tasks (15) — starter backlog to expand
- **Epic: Donation Management**
  - Story: *As a donor, I want to give a one-time or recurring donation so that I can support relief efforts.*
    - Tasks: build donation form; validate amount/currency; persist Donation; generate tax certificate.
  - Story: *As an anonymous guest, I want to donate without an account so that giving is friction-free.*
- **Epic: Volunteer Management**
  - Story: *As a volunteer, I want to register my skills and availability so that I can be matched to projects.*
- **Epic: Relief Project Coordination**
  - Story: *As an employee, I want to post updates on a project so that stakeholders stay informed.*
- **Epic: Authentication & Roles**
  - Story: *As an employee, I want a secure login so that only staff can access the dashboard.*
- Explanation angle: prioritisation by business value + risk (auth & donations first); vertical slices.

### 1.3 Sprint organisation (5)
- **Sprint 1 (Prototype):** Auth + roles, Donation form + certificate, Volunteer form, Employee dashboard, deploy to App Service. *Goal: demonstrable end-to-end prototype.*
- **Sprint 2:** Azure Functions, Git branching, CI pipeline, NuGet helper package.
- **Sprint 3:** Full test suite, CD pipeline, load testing, handover docs.
- Each sprint: list Goal, committed stories, and Deliverables.

---

## Section B — Azure SQL Database (35)

### 2.1 Why database design matters (10) — argument scaffold
- **Scalability:** thousands of concurrent volunteer registrations during a disaster → connection pooling,
  appropriate service tier, indexing on hot columns, avoiding table scans.
- **Data integrity:** primary keys + foreign keys + unique constraints prevent duplicate donors/records;
  transactions keep donation + certificate consistent.
- **Efficiency:** normalisation removes redundancy; indexes speed look-ups; referential integrity means
  reliable joins for fast decision-making mid-crisis. Tie each point back to Gift of the Givers operations.

### 2.2 Schema — as implemented in this solution (draw your own ERD from this)
| Entity | Key attributes (type) | Relationships |
|---|---|---|
| **AspNetUsers** (Identity) | Id (nvarchar PK), Email, FullName, PasswordHash | 1..* to AspNetUserRoles |
| **ReliefProject** | Id (int PK), Name (nvarchar), Location, Description, Status, CreatedOn (datetime) | 1..* ProjectUpdate |
| **ProjectUpdate** | Id (int PK), ReliefProjectId (int FK), Title, Body, PostedBy, PostedOn (datetime) | *..1 ReliefProject |
| **Donation** | Id (int PK), DonorName, DonorEmail, Amount (decimal 18,2), Currency, IsRecurring (bit), RecurringMonths (int), IsAnonymous (bit), CreatedOn (datetime) | (optional link to a donor user) |
| **Volunteer** | Id (int PK), FullName, Email, Skills, Availability, CreatedOn (datetime) | — |

- **Why these entities:** they map directly to the Foundation's core operations (staff, projects, giving, helping).
- **Why these relationships:** ProjectUpdate→ReliefProject (one project has many updates) models the real reporting flow.
- **In practice:** enables the employee dashboard, donation reporting and volunteer matching.
- **ACTION (yours, not AI):** produce the ERD diagram by hand / in a drawing tool showing PK/FK lines.

### 2.3 Performance optimisation (5)
- **Indexes:** non-clustered indexes on `Donation.CreatedOn`, `Volunteer.CreatedOn`, `ProjectUpdate.PostedOn`
  (already declared in `ApplicationDbContext.OnModelCreating`); consider an index on `Donation.Currency` for reporting.
- **Query optimisation:** paginate dashboard queries (`Take`), project only needed columns.
- **Partitioning:** donations could be partitioned by year/month once volume grows (archival + faster ranges).

---

## Section C — Azure App Services (35)

### 3.1 .NET Framework vs .NET Core (5) — comparison scaffold
- **.NET Framework:** Windows-only, mature, legacy WebForms/WCF; not cross-platform.
- **.NET Core / modern .NET (8):** cross-platform, open source, high performance (Kestrel), modular, container-friendly.
- **Recommendation:** .NET 8 for an Azure-hosted app — **portability** (Linux App Service = cheaper),
  **performance** (faster request throughput), **cloud-readiness** (built-in DI, config, health checks, containers).

### 3.2 Prototype (20)
- Implemented in `src/GiftOfTheGivers.Web` — see README for the feature checklist and demo accounts.
- *Insert screenshots of: Home, Login, Donation form, Donation confirmation + certificate, Volunteer form, Employee dashboard.*

### 3.3 Publishing to Azure App Services (10)
- Right-click `GiftOfTheGivers.Web` → **Publish** → Azure → App Service (Linux), or use `azure-pipelines.yml`.
- Set `DatabaseProvider=SqlServer` and the Azure SQL connection string in App Service → Configuration.
- *Insert: live URL + screenshots of the publish wizard and the running site.*
- Reflection angle: cloud deployment gives elastic scale during disaster spikes, global availability, and managed reliability.
