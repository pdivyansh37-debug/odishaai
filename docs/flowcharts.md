# GraamSeva AI — Architecture Flowcharts
> AI for Governance & Social Good | Odisha AI Hackathon 2026

## 1️⃣ Overall System Architecture

```mermaid
flowchart TD
    A["👤 Citizen\nMobile / Web"] -->|Voice / Text / Odia| B["🌐 React PWA Frontend"]
    C["🧑‍💼 Panchayat Officer"] -->|Login| D["📊 Admin Dashboard"]

    B --> E["⚡ FastAPI Backend"]
    D --> E

    E --> F["🤖 Gemini AI\nChatbot Engine"]
    E --> G["📋 Scheme\nEligibility Engine"]
    E --> H["📬 Grievance\nManagement"]
    E --> I["🌐 IndicTrans2\nOdia Translator"]

    F --> J[("🗄️ PostgreSQL\nDatabase")]
    G --> J
    H --> J

    H --> K["📱 WhatsApp\nAlert - Twilio"]
    H --> L["📍 CSC Locator\nOpenStreetMap"]

    J --> M["📊 Analytics\nHeatmap Reports"]
    M --> D

    style A fill:#4CAF50,color:#fff
    style C fill:#2196F3,color:#fff
    style E fill:#FF9800,color:#fff
    style F fill:#9C27B0,color:#fff
    style J fill:#607D8B,color:#fff
```

## 2️⃣ Citizen — Scheme Eligibility Flow

```mermaid
flowchart TD
    A(["🚀 Citizen Opens App"]) --> B{"Choose Language"}
    B -->|Odia| C["🗣️ Voice / Text in Odia"]
    B -->|Hindi| C
    B -->|English| C

    C --> D["AI understands intent via Gemini NLP"]
    D --> E{"What does citizen want?"}

    E -->|Find Schemes| F["📋 Eligibility Questionnaire"]
    E -->|File Grievance| Z["➡️ Go to Grievance Flow"]
    E -->|Find CSC Center| Y["📍 Show Nearest Jan Seva Kendra"]

    F --> F1["Ask: Age?"]
    F1 --> F2["Ask: Income?"]
    F2 --> F3["Ask: Caste / Category?"]
    F3 --> F4["Ask: Land holding?"]
    F4 --> F5["Ask: Occupation?"]
    F5 --> G["🤖 Eligibility Engine Matches Against Rules"]

    G --> H{"Schemes Found?"}
    H -->|Yes| I["✅ Show Matched Schemes in Odia with Benefits"]
    H -->|No| J["❌ No schemes matched - Suggest nearest help center"]

    I --> K["📋 Show Document Checklist for each scheme"]
    K --> L["🔗 Link to Apply Online or nearest CSC"]
    L --> M(["✅ Done — Citizen Informed"])

    style A fill:#4CAF50,color:#fff
    style M fill:#4CAF50,color:#fff
    style I fill:#2196F3,color:#fff
    style J fill:#f44336,color:#fff
    style G fill:#9C27B0,color:#fff
```

## 3️⃣ Grievance Filing Flow

```mermaid
flowchart TD
    A(["😤 Citizen has a Complaint"]) --> B["Open GraamSeva AI Grievance Section"]
    B --> C{"Input Method?"}

    C -->|Voice| D["🎙️ Speak complaint in Odia"]
    C -->|Text| E["⌨️ Type complaint"]
    C -->|Photo| F["📷 Upload photo of problem"]

    D --> G["Whisper AI Transcribes Odia Audio"]
    E --> G
    F --> H["Vision AI Describes the image"]
    H --> G

    G --> I["🤖 Gemini AI Categorizes Complaint"]
    I --> J{"Category?"}

    J -->|Road/Infra| K1["🏗️ Dept: PWD"]
    J -->|Water/Sanitation| K2["💧 Dept: PHED"]
    J -->|Ration/PDS| K3["🌾 Dept: Food Supply"]
    J -->|School/Education| K4["📚 Dept: School and ME"]
    J -->|Health| K5["🏥 Dept: Health"]
    J -->|Land Dispute| K6["🗺️ Dept: Revenue"]

    K1 & K2 & K3 & K4 & K5 & K6 --> L["🔁 Check Duplicates"]
    L --> M{"Duplicate Found?"}
    M -->|Yes| N["📌 Link to existing ticket + status update"]
    M -->|No| O["🎫 Generate Unique Ticket ID"]

    O --> P["💾 Save to Database with GPS + timestamp"]
    P --> Q["📱 Send WhatsApp SMS to citizen with Ticket ID"]
    Q --> R["🔔 Notify Concerned Department Officer"]
    R --> S["⏱️ SLA Timer Starts 3 / 7 / 15 days"]
    S --> T{"Resolved within SLA?"}

    T -->|Yes| U["✅ Auto-notify citizen — Complaint Resolved"]
    T -->|No| V["🚨 Escalate to District Collector"]
    V --> W["📊 Marked as Overdue in Dashboard"]

    style A fill:#f44336,color:#fff
    style U fill:#4CAF50,color:#fff
    style V fill:#FF5722,color:#fff
    style I fill:#9C27B0,color:#fff
    style O fill:#2196F3,color:#fff
```

## 4️⃣ AI Processing Pipeline

```mermaid
flowchart LR
    A["📥 Raw Input Voice / Text / Image"] --> B["🌐 Language Detector"]

    B -->|Odia| C["IndicTrans2 Odia to English"]
    B -->|Hindi| C
    B -->|English| D

    C --> D["📝 Cleaned English Text"]
    D --> E["🤖 Gemini API Intent Classifier"]
    E --> F{"Intent Type"}

    F -->|Scheme Query| G["RAG Engine Search Scheme DB"]
    F -->|Grievance| H["Category Classifier"]
    F -->|Legal Query| I["Legal Doc RAG Search"]
    F -->|General| J["General QA Response"]

    G --> K["Top matching schemes retrieved"]
    H --> L["Department Assigned"]
    I --> M["Relevant law sections retrieved"]

    K & L & M & J --> N["📝 Response Generator Gemini API"]
    N --> O["🌐 IndicTrans2 English to Odia"]
    O --> P["📤 Final Response to Citizen in Odia"]

    style A fill:#607D8B,color:#fff
    style E fill:#9C27B0,color:#fff
    style N fill:#9C27B0,color:#fff
    style P fill:#4CAF50,color:#fff
```

## 5️⃣ Admin Dashboard Flow

```mermaid
flowchart TD
    A(["🧑‍💼 Officer Logs In"]) --> B["📊 Main Dashboard"]
    B --> C{"Select View"}

    C -->|Overview| D["📈 Today's Stats New / Pending / Resolved"]
    C -->|Map View| E["🗺️ Grievance Heatmap by District / Block"]
    C -->|Complaints| F["📋 Complaint List with Filters"]
    C -->|Reports| G["📄 Auto-Generated Weekly Report"]

    D --> D1["Pie charts by category - Bar charts by dept"]
    E --> E1["Hotspot circles - Click to see complaints"]
    F --> F1{"Filter By"}
    F1 -->|Status| F2["Pending / Resolved / Overdue"]
    F1 -->|Category| F3["Road / Water / Ration etc."]
    F1 -->|Date| F4["Today / Week / Month"]

    F2 & F3 & F4 --> H["📋 View Individual Complaint Detail"]
    H --> I{"Officer Action"}
    I -->|Assign| J["👤 Assign to Field Officer"]
    I -->|Resolve| K["✅ Mark Resolved + Auto-notify Citizen"]
    I -->|Escalate| L["🚨 Escalate to District Level"]
    I -->|Reply| M["🤖 AI Draft Reply in Odia — 1 click"]

    G --> G1["PDF Download - Email to Collector"]

    style A fill:#2196F3,color:#fff
    style K fill:#4CAF50,color:#fff
    style L fill:#f44336,color:#fff
    style M fill:#9C27B0,color:#fff
```

## 6️⃣ 5-Day Build Timeline

```mermaid
flowchart LR
    D1["📅 DAY 1\nFastAPI setup\nPostgreSQL schema\nReact skeleton\n8 Odisha schemes DB"]
    D2["📅 DAY 2\nGemini API chatbot\nEligibility engine\nIndicTrans2 Odia\nRAG with scheme docs"]
    D3["📅 DAY 3\nGrievance module\nDuplicate detection\nWhatsApp alerts\nDept routing logic"]
    D4["📅 DAY 4\nAdmin dashboard\nHeatmap Leaflet\nSLA tracker\nAI draft reply"]
    D5["📅 DAY 5\nUI polish Tailwind\nPWA setup offline\nDeploy to Railway\nPresentation deck"]

    D1 --> D2 --> D3 --> D4 --> D5

    style D1 fill:#E91E63,color:#fff
    style D2 fill:#9C27B0,color:#fff
    style D3 fill:#2196F3,color:#fff
    style D4 fill:#FF9800,color:#fff
    style D5 fill:#4CAF50,color:#fff
```

## 7️⃣ Database Schema

```mermaid
erDiagram
    citizens {
        int id PK
        string phone UK
        string name
        string aadhaar_last4
        string district
        string block
        json profile_json
        datetime created_at
    }
    schemes {
        int id PK
        string name_odia
        string name_en
        string dept
        text benefits
        json rules_json
        json eligibility_criteria
        json documents_required
        bool is_active
    }
    grievances {
        int id PK
        string ticket_id UK
        int citizen_id FK
        string category
        string dept_assigned
        string status
        datetime sla_deadline
        float lat
        float lng
        text description
        string image_url
        datetime created_at
        datetime resolved_at
    }
    eligibility_checks {
        int id PK
        int citizen_id FK
        json schemes_matched
        json input_data_json
        datetime created_at
    }
    notifications {
        int id PK
        int grievance_id FK
        string type
        string channel
        text message
        datetime sent_at
        string status
    }
    officers {
        int id PK
        string name
        string email UK
        string hashed_password
        string dept
        string district
        string role
        bool is_active
    }

    citizens ||--o{ grievances : "files"
    citizens ||--o{ eligibility_checks : "checks"
    grievances ||--o{ notifications : "triggers"
    schemes ||--o{ eligibility_checks : "matched_in"
```

